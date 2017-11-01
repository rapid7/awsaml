'use strict';

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
  app.set('configureUrl', `http://${config.server.host}:${config.server.port}/configure`);
  app.set('refreshUrl', `http://${config.server.host}:${config.server.port}/refresh`);
  app.set('logoutUrl', `http://${config.server.host}:${config.server.port}/logout`);
  app.set('views', path.join(__dirname, '..', 'views'));
  app.set('view engine', 'jsx');
  app.engine('jsx', require('express-react-views').createEngine());
  app.use(express.static(path.join(__dirname, '..', 'public')));
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

  return app;
};
