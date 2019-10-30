const express = require('express');
const config = require('../config');
const Aws = require('aws-sdk');
const AwsCredentials = require('../aws-credentials');
const ResponseObj = require('./../response');

const router = express.Router();
const credentials = new AwsCredentials(config.aws);

module.exports = (app) => {
  router.all('/', (req, res) => {
    const sts = new Aws.STS();
    const session = req.session.passport;

    if (session === undefined) {
      return res.status(401).json({
        error: 'Invalid session',
      });
    }

    const refreshResponseObj = Object.assign({}, ResponseObj, {
      accountId: session.accountId,
      roleName: session.roleName,
      showRole: session.showRole,
    });

    sts.assumeRoleWithSAML({
      DurationSeconds: config.aws.duration,
      PrincipalArn: session.principalArn,
      RoleArn: session.roleArn,
      SAMLAssertion: session.samlResponse,
    }, (assumeRoleErr, data) => {
      if (assumeRoleErr) {
        return res.json({
          redirect: config.auth.entryPoint,
        });
      }

      const credentialResponseObj = Object.assign({}, refreshResponseObj, {
        accessKey: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
      });

      const profileName = `awsaml-${session.accountId}`;
      const metadataUrl = app.get('metadataUrl');

      // Update the stored profile with account number(s) and profile names
      const metadataUrls = (Storage.get('metadataUrls') || []).map((metadata) => {
        if (metadata.url === metadataUrl) {
          // If the stored metadataUrl label value is the same as the URL
          // default to the profile name!
          if (metadata.name === metadataUrl) {
            metadata.name = profileName;
          }
          metadata.roles = session.roles.map((role) => role.roleArn);
        }

        return metadata;
      });

      Storage.set('metadataUrls', metadataUrls);

      // Fetch the metadata profile name for this URL
      const profile = metadataUrls.find((metadata) => metadata.url === metadataUrl);

      credentialResponseObj.profileName = profile.name;

      credentials.save(data.Credentials, profile.name, (credSaveErr) => {
        if (credSaveErr) {
          res.json(Object.assign({}, credentialResponseObj, {
            error: credSaveErr,
          }));
        } else {
          res.json(credentialResponseObj);
        }
      });
    });
  });

  return router;
};
