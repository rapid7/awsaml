const {
  app,
} = require('../api/server');

async function logout() {
  Storage.set('session', {});
  app.set('entryPointUrl', null);

  return {
    logout: true,
  };
}

module.exports = {
  logout,
};
