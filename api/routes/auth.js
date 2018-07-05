const url = require('url');
const express = require('express');

const router = express.Router();

module.exports = (app, auth) => {
  router.post('/', auth.authenticate('saml', {
    failureFlash: true,
    failureRedirect: app.get('configureUrl'),
  }), (req, res) => {
    const arns = req.user['https://aws.amazon.com/SAML/Attributes/Role'].split(',');

    /* eslint-disable no-param-reassign */
    req.session.passport.samlResponse = req.body.SAMLResponse;
    req.session.passport.roleArn = arns[0];
    req.session.passport.principalArn = arns[1];
    req.session.passport.accountId = arns[0].split(':')[4]; // eslint-disable-line rapid7/static-magic-numbers
    /* eslint-enable no-param-reassign */
    let frontend = process.env.ELECTRON_START_URL || app.get('baseUrl');

    frontend = new url.URL(frontend);
    frontend.searchParams.set('auth', 'true');
    res.redirect(frontend);
  });

  return router;
};
