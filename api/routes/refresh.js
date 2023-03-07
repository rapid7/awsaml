const express = require('express');
const { STSClient, AssumeRoleWithSAMLCommand } = require('@aws-sdk/client-sts');
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

    const refreshResponseObj = {
      ...ResponseObj,
      accountId: session.accountId,
      roleName: session.roleName,
      showRole: session.showRole,
    };

    const client = new STSClient({ region });

    const input = {
      DurationSeconds: config.aws.duration,
      PrincipalArn: session.principalArn,
      RoleArn: session.roleArn,
      SAMLAssertion: session.samlResponse,
    };

    const command = new AssumeRoleWithSAMLCommand(input);
    client
      .send(command)
      .then((data) => {
        const credentialResponseObj = {
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
              ...credentialResponseObj,
              error: credSaveErr,
            });
          }

          return res.json(credentialResponseObj);
        }, region);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return res.json({
          redirect: config.auth.entryPoint,
        });
      });
  });

  return router;
};
