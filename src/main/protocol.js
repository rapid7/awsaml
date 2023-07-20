const {
  protocol,
  session
} = require('electron');
const {
  readFileSync,
} = require('node:fs');
const url = require('node:url');
const {refresh_jit} = require("./containers/refresh-jit");

function registerSchemas() {
  protocol.registerSchemesAsPrivileged([{
    scheme: 'jit',
    privileges: { supportFetchAPI: true }
  }]);
}
function registerHandlers() {

  protocol.handle('awsaml', (request) => {
    const prefix = 'awsaml://'.length;

    return new Response(readFileSync(url.fileURLToPath(`file://${request.url.slice(prefix)}`)));
  });

  protocol.handle('jit', async(request) => {
    let sessionId;
    return session.defaultSession.cookies.get({})
        .then(async (cookies) => {
          sessionId = cookies.find((cookie) => cookie.name === 'session_id');
          const reqBody = JSON.parse(Buffer.from((await request.body.getReader().read()).value).toString());
          const profile = {
            ...reqBody,
            roleName: reqBody.roleArn.split('/')[1],
            header: {
              'X-Auth-Token': sessionId.value,
            },
            apiUri: `http://${request.url.split('jit://')[1]}`,
            showRole: false,
          };
          const data = await refresh_jit(profile);
          return new Response(JSON.stringify(data))
        })
        .catch((err) => {
          const body = JSON.stringify({
            error_message: err?.message || 'unknown',
            error_type: err?.error_type || 'unknown'
          });
          return new Response(body, {status:500})
        })
  });
}

module.exports = {
  registerHandlers,
  registerSchemas
};
