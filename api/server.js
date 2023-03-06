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
    name: '/configure',
    route: require('./routes/configure')(app, auth),
  }, {
    name: '/logout',
    route: require('./routes/logout')(app),
  }, {
    name: '/refresh',
    route: require('./routes/refresh')(app),
  }, {
    name: '/profile',
    route: require('./routes/profile')(),
  }, {
    name: '/select-role',
    route: require('./routes/select-role')(),
  }, {
    name: '/',
    route: require('./routes/static')(),
  },
].forEach((el) => {
  app.use(el.name, el.route);
});
app.all('*', auth.guard);

module.exports = app;
