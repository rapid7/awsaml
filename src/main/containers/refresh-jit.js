const AwsCredentials = require('../api/aws-credentials');
const ResponseObj = require('../api/response');
const Reloader = require('../api/reloader/reloader');

const credentials = new AwsCredentials();

async function refreshJitCallback(profileName, session) {
  const refreshResponseObj = {
    ...ResponseObj,
    accountId: session.accountId,
    roleName: session.roleName,
    showRole: session.showRole,
    profileName,
  };

  let creds = {};
  let response;
  try {
    response = await fetch(encodeURI(session.apiUri), {
      method: 'GET',
      headers: session.header,
    });
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    Manager.removeByName(profileName);
    throw new Error(`AWSAML is unable to fetch credentials from ICS. HTTPS request to URI: ${session.apiUri}`);
  }

  if (response.ok) {
    creds = await response.json();
  } else {
    Manager.removeByName(profileName);
    throw new Error('An error occurred while fetching credentials from ICS');
  }

  const credentialResponseObj = {
    ...refreshResponseObj,
    accessKey: creds.AccessKeyId,
    secretKey: creds.SecretAccessKey,
    sessionToken: creds.SessionToken,
    expiration: creds.Expiration,
  };

  try {
    credentials.saveSync(creds, profileName, session.region);
  } catch (e) {
    return {
      ...credentialResponseObj,
      error: e,
    };
  }

  return credentialResponseObj;
}

async function refreshJit(session) {
  const profileName = `awsaml-${session.accountId}`;
  let r = Manager.get(profileName);

  if (!r) {
    r = new Reloader({
      name: profileName,
      async callback() {
        await refreshJitCallback(profileName, session).catch(e => console.log(e));
      },
      interval: (session.duration / 2) * 1000,
      role: session.roleConfigId,
    });
    Manager.add(r);
    r.start();
  } else {
    if (session.roleConfigId !== r.role) {
      r.role = session.roleConfigId;
      r.setCallback(
        async () => {
          await refreshJitCallback(profileName, session).catch(e => console.log(e));
        },
      );
      r.role = session.roleConfigId;
    }
    r.restart();
  }
  return refreshJitCallback(profileName, session).catch(e => console.log(e));
}

module.exports = {
  refreshJit,
};
