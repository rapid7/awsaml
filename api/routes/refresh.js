const express = require('express');
const router = express.Router();

const config = require('../config');

const Aws = require('aws-sdk');
const AwsCredentials = require('../aws-credentials');
const credentials = new AwsCredentials(config.aws);

const ResponseObj = require('./../response');

module.exports = (app) => {
  router.all('/', (req, res) => {
    const sts = new Aws.STS();
    const session = req.session.passport;

    if (session === undefined) {
      res.status(401).json({
        error: 'Invalid session'
      });
      return;
    }

    const refreshResponseObj = Object.assign(ResponseObj, {
      accountId: session.accountId
    });

    sts.assumeRoleWithSAML({
      PrincipalArn: session.principalArn,
      RoleArn: session.roleArn,
      SAMLAssertion: session.samlResponse,
      DurationSeconds: config.aws.duration
    }, (assumeRoleErr, data) => {
      if (assumeRoleErr) {
        res.json({
          redirect: config.auth.entryPoint
        });

        return;
      }

      const credentialResponseObj = Object.assign(refreshResponseObj, {
        accessKey: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken
      });

      const profileName = `awsaml-${session.accountId}`;
      const metadataUrl = app.get('metadataUrl');
      let metadataUrls = Storage.get('metadataUrls');

      // If the stored metadataUrl label value is the same as the URL default to the profile name!
      metadataUrls = metadataUrls.map((p) => {
        if (p.url === metadataUrl && p.name === metadataUrl) {
          p.name = profileName;
        }
        return p;
      });
      Storage.set('metadataUrls', metadataUrls);

      credentials.save(data.Credentials, profileName, (credSaveErr) => {
        if (credSaveErr) {
          res.json(Object.assign(credentialResponseObj, {
            error: credSaveErr
          }));
        } else {
          res.json(credentialResponseObj);
        }
      });
    });
  });

  return router;
};
