const { STSClient, AssumeRoleWithSAMLCommand } = require('@aws-sdk/client-sts');
const config = require('../api/config.json');
const AwsCredentials = require('../api/aws-credentials');
const ResponseObj = require('../api/response');
const {
  app,
} = require('../api/server');

const credentials = new AwsCredentials();

async function refresh() {
  const session = Storage.get('session');

  if (session === undefined) {
    return {
      error: 'Invalid session',
      logout: true,
    };
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

  let data;
  const command = new AssumeRoleWithSAMLCommand(input);
  try {
    data = await client.send(command);
  } catch (e) {
    console.error(e); // eslint-disable-line no-console
    return {
      redirect: config.auth.entryPoint,
      logout: true,
    };
  }

  const credentialResponseObj = {
    ...refreshResponseObj,
    accessKey: data.Credentials.AccessKeyId,
    secretKey: data.Credentials.SecretAccessKey,
    sessionToken: data.Credentials.SessionToken,
    expiration: data.Credentials.Expiration,
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

  try {
    credentials.saveSync(data.Credentials, profileName, region);
  } catch (e) {
    return {
      ...credentialResponseObj,
      error: e,
    };
  }

  return credentialResponseObj;
}

module.exports = {
  refresh,
};
