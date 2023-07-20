const {
  protocol,
  session,
} = require('electron');
const {
  readFileSync,
} = require('node:fs');
const url = require('node:url');
const { refreshJit } = require('./containers/refresh-jit');

function registerSchemas() {
  protocol.registerSchemesAsPrivileged([{
    scheme: 'jit',
    privileges: { supportFetchAPI: true },
  }]);
}
function registerHandlers() {
  protocol.handle('awsaml', (request) => {
    const prefix = 'awsaml://'.length;

    return new Response(readFileSync(url.fileURLToPath(`file://${request.url.slice(prefix)}`)));
  });

  protocol.handle('jit', async (request) => {
    let sessionId;
    const { host, pathname } = new URL(request.url);
    return session.defaultSession.cookies.get({})
      .then(async (cookies) => {
        sessionId = cookies.find((cookie) => cookie.name === 'session_id');
        const body = await request.body.getReader().read();
        const reqBody = JSON.parse(Buffer.from(body.value).toString());
        const profile = {
          ...reqBody,
          roleName: reqBody.roleArn.split('/')[1],
          header: {
            'X-Auth-Token': sessionId.value,
          },
          apiUri: `http://${host}${pathname}`,
          showRole: false,
        };
        const data = await refreshJit(profile);
        return new Response(JSON.stringify(data));
      })
      .catch((err) => {
        const body = JSON.stringify({
          error_message: err?.message || 'unknown',
          error_type: err?.error_type || 'unknown',
        });
        return new Response(body, { status: 500 });
      });
  });
}

module.exports = {
  registerHandlers,
  registerSchemas,
};
