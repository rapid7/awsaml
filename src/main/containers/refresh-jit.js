const AwsCredentials = require('../api/aws-credentials');
const ResponseObj = require('../api/response');
const Reloader = require("../api/reloader/reloader");

const credentials = new AwsCredentials();

async function refresh_jit(session=null) {
  const profileName = `awsaml-${session.accountId}`;
  let r = Manager.get(profileName);

  if (!r) {
    r = new Reloader ( {
      name: profileName,
      callback: async function () {
        await refresh_jit_callback(profileName, session)
      },
      interval: (session.duration / 2) * 1000,
      role: session.roleConfigId,
    });
    Manager.add(r);
    r.start();
  } else {
    if (session.roleConfigId !== r.role) {
      r.role = session.roleConfigId
      r.setCallback(
          async function () {
            await refresh_jit_callback(profileName, session)
          }
      )
      r.role = session.roleConfigId
    }
    r.restart();
  }
  return await refresh_jit_callback(profileName, session);
}

async function refresh_jit_callback(profileName, session) {
  const refreshResponseObj = {
    ...ResponseObj,
    accountId: session.accountId,
    roleName: session.roleName,
    showRole: session.showRole,
    profileName: profileName
  };


  let creds = {};
  await fetch(session.apiUri.replace('localhost', '127.0.0.1'), {
    method: 'GET',
    headers: session.header,
  }).then(async (response) => {
    if (response.ok){
      creds = await response.json();
    } else {
      Manager.removeByName(profileName)
      throw new Error("Unable to retrieve credentials from Divvy")
    }
  })


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

module.exports = {
  refresh_jit,
};
