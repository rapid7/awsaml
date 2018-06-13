const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const app = express();

module.exports = (auth, config, secret) => {
  app.set('host', config.server.host);
  app.set('port', config.server.port);
  app.set('baseUrl', `http://${config.server.host}:${config.server.port}/`);
  app.set('configureUrlRoute', 'configure');
  app.set('refreshUrlRoute', 'refresh');
  app.use(morgan('dev'));
  app.use(cookieParser(secret));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(expressSession({
    secret,
    resave: false,
    saveUninitialized: true
  }));
  app.use(auth.initialize());
  app.use(auth.session());
  app.use(express.static(path.join(__dirname, '..', 'build')));
  if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
      res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
      next();
    });
  }

  return app;
};
