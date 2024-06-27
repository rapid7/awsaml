const config = require('./config.json');
const Auth = require('./auth');

const sessionSecret = process.env.SESSION_SECRET;

const auth = new Auth(config.auth);
const app = require('./server-config')(auth, config, sessionSecret);
const authRoute = require('./routes/auth')(app, auth);

app.use(config.auth.path, authRoute);
app.all('*', auth.guard);

module.exports = {
  app,
  auth,
};
