const express = require('express');
const {
  authHandler,
} = require('../../containers/auth');

const router = express.Router();

module.exports = (app, auth) => {
  router.post('/', auth.authenticate('saml', {
    failureFlash: true,
    failureRedirect: app.get('configureUrl'),
  }), authHandler(app));

  return router;
};
