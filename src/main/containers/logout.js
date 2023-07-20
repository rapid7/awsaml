const {
  app,
} = require('../api/server');

async function logout() {
  const session = Storage.get('session');
  const profileName = `awsaml-${session.accountId}`;
  const reloader = Manager.get(profileName);
  reloader.stop();
  Manager.removeByReloader(reloader)

  Storage.set('session', {});
  app.set('entryPointUrl', null);
  Storage.set('authenticated', false);
  Storage.set('multipleRoles', false);

  return {
    logout: true,
  };
}

module.exports = {
  logout,
};
