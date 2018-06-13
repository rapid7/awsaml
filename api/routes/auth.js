'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app, auth) => {
  router.post('/', auth.authenticate('saml', {
    failureRedirect: app.get('configureUrl'),
    failureFlash: true
  }), (req, res) => {
    const arns = req.user['https://aws.amazon.com/SAML/Attributes/Role'].split(',');

    /* eslint-disable no-param-reassign */
    req.session.passport.samlResponse = req.body.SAMLResponse;
    req.session.passport.roleArn = arns[0];
    req.session.passport.principalArn = arns[1];
    req.session.passport.accountId = arns[0].split(':')[4]; // eslint-disable-line rapid7/static-magic-numbers
    /* eslint-enable no-param-reassign */
    res.redirect('/refresh');
  });

  return router;
};
