const {
  app,
} = require('../api/server');

async function logout() {
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
