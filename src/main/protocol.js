const {
  protocol,
  session,
} = require('electron');
const {
  readFileSync,
} = require('node:fs');
const url = require('node:url');
const { refreshJit } = require('./containers/refresh-jit');

const isWindows = process.platform === 'win32';

function registerSchemas() {
  protocol.registerSchemesAsPrivileged([{
    scheme: 'jit',
    privileges: { supportFetchAPI: true },
  }]);
}

function registerHandlers() {
  protocol.handle('awsaml', (request) => {
    let prefix;
    let filePath;
    if (isWindows) {
      prefix = 'awsaml://C:';
      filePath = `file://C:/${request.url.slice(prefix.length)}`;
    } else {
      prefix = 'awsaml://';
      filePath = `file://${request.url.slice(prefix.length)}`;
    }
    console.log(filePath);
    return new Response(readFileSync(url.fileURLToPath(filePath)));
  });

  protocol.handle('jit', async (request) => {
    const { host, pathname } = new URL(request.url);
    if (host === 'get-active-profiles') {
      const activeProfiles = Object.values(Manager.reloaders).map((r) => r.role);
      return new Response(JSON.stringify({ activeProfiles }));
    }

    const sessionId = await session.defaultSession.cookies.get({ name: 'session_id', domain: host });
    const body = await request.body.getReader().read();
    const reqBody = JSON.parse(Buffer.from(body.value).toString());
    const profile = {
      ...reqBody,
      roleName: reqBody.roleArn.split('/')[1],
      header: {
        'X-Auth-Token': sessionId[0].value,
      },
      apiUri: `https://${host}${pathname}`,
      showRole: false,
    };

    let data;
    try {
      data = await refreshJit(profile);
    } catch (err) {
      const errBody = JSON.stringify({
        error_message: err?.message || 'unknown',
        error_type: err?.error_type || 'unknown',
      });
      return new Response(errBody, { status: 500 });
    }

    const activeProfiles = Object.values(Manager.reloaders).map((r) => r.role);
    data.activeProfiles = activeProfiles;
    return new Response(JSON.stringify(data));
  });
}

module.exports = {
  registerHandlers,
  registerSchemas,
};
