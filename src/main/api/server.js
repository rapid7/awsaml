const config = require('./config.json');
const Auth = require('./auth');

const sessionSecret = '491F9BAD-DFFF-46E2-A0F9-56397B538060';

const auth = new Auth(config.auth);
const app = require('./server-config')(auth, config, sessionSecret);
const authRoute = require('./routes/auth')(app, auth);

app.use(config.auth.path, authRoute);
app.all('*', auth.guard);

module.exports = {
  app,
  auth,
};
