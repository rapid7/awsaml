const config = require('./config.json');
const Auth = require('./auth');

const sessionSecret = '491F9BAD-DFFF-46E2-A0F9-56397B538060';

const auth = new Auth(config.auth);
const app = require('./server-config')(auth, config, sessionSecret);

[
  {
    name: config.auth.path,
    route: require('./routes/auth')(app, auth),
  }, {
    name: '/',
    route: require('./routes/static')(),
  },
].forEach((el) => {
  app.use(el.name, el.route);
});
app.all('*', auth.guard);

module.exports = {
  app,
  auth,
};
