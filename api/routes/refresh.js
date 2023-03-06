const express = require('express');
const Aws = require('aws-sdk');
const config = require('../config.json');
const AwsCredentials = require('../aws-credentials');
const ResponseObj = require('../response');

const router = express.Router();
const credentials = new AwsCredentials(config.aws);

module.exports = (app) => {
  // eslint-disable-next-line consistent-return
  router.all('/', (req, res) => {
    const session = req.session.passport;

    if (session === undefined) {
      return res.status(401).json({
        error: 'Invalid session',
      });
    }

    const region = session.roleArn.includes('aws-us-gov') ? 'us-gov-west-1' : 'us-east-1';

    Aws.config.update({ region });

    const sts = new Aws.STS();

    const refreshResponseObj = {
      // eslint-disable-next-line node/no-unsupported-features/es-syntax
      ...ResponseObj,
      accountId: session.accountId,
      roleName: session.roleName,
      showRole: session.showRole,
    };

    sts.assumeRoleWithSAML({
      DurationSeconds: config.aws.duration,
      PrincipalArn: session.principalArn,
      RoleArn: session.roleArn,
      SAMLAssertion: session.samlResponse,
      // eslint-disable-next-line consistent-return
    }, (assumeRoleErr, data) => {
      if (assumeRoleErr) {
        return res.json({
          redirect: config.auth.entryPoint,
        });
      }

      const credentialResponseObj = {
        // eslint-disable-next-line node/no-unsupported-features/es-syntax
        ...refreshResponseObj,
        accessKey: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken,
      };

      const profileName = `awsaml-${session.accountId}`;
      const metadataUrl = app.get('metadataUrl');

      // Update the stored profile with account number(s) and profile names
      const metadataUrls = (Storage.get('metadataUrls') || []).map((metadata) => {
        const ret = {
          // eslint-disable-next-line node/no-unsupported-features/es-syntax
          ...metadata,
        };

        if (metadata.url === metadataUrl) {
          // If the stored metadataUrl label value is the same as the URL
          // default to the profile name!
          if (metadata.name === metadataUrl) {
            ret.name = profileName;
          }
          ret.roles = session.roles.map((role) => role.roleArn);
        }

        return ret;
      });

      Storage.set('metadataUrls', metadataUrls);

      // Fetch the metadata profile name for this URL
      const profile = metadataUrls.find((metadata) => metadata.url === metadataUrl);

      credentialResponseObj.profileName = profile.name;

      credentials.save(data.Credentials, profileName, (credSaveErr) => {
        if (credSaveErr) {
          return res.json({
            // eslint-disable-next-line node/no-unsupported-features/es-syntax
            ...credentialResponseObj,
            error: credSaveErr,
          });
        }

        return res.json(credentialResponseObj);
      }, region);
    });
  });

  return router;
};
