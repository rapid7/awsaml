const url = require('url');
const express = require('express');

const router = express.Router();

module.exports = (app, auth) => {
  router.post('/', auth.authenticate('saml', {
    failureFlash: true,
    failureRedirect: app.get('configureUrl'),
  }), (req, res) => {

    roleAttr = req.user['https://aws.amazon.com/SAML/Attributes/Role']
    if (!Array.isArray(roleAttr)) {
      roleAttr = [roleAttr]
    }

    let roles = roleAttr.map( (attr, i) => {
      let arns = attr.split(',');
      return {
        index: i,
        roleArn: arns[0],
        roleName: arns[0].split(':')[5].replace('role/', ''),
        principalArn: arns[1],
        accountId: arns[0].split(':')[4],
      }
    });

    const session = req.session.passport;
    session.samlResponse = req.body.SAMLResponse;
    session.roles = roles;

    let frontend = process.env.ELECTRON_START_URL || app.get('baseUrl');
    frontend = new url.URL(frontend);

    if (roles.length > 1) {
      // If the session has a previous role, see if it matches
      // the latest roles from the current SAML assertion.  If it
      // doesn't match, wipe it from the session.
      if (session.roleArn && session.principalArn) {
        let found = roles.find(role => {
          return role.roleArn === session.roleArn &&
            role.principalArn === session.principalArn;
        });

        if (!found) {
          session.showRole = undefined;
          session.roleArn = undefined;
          session.roleName = undefined;
          session.principalArn = undefined;
          session.accountId = undefined;
        }
      }

      // If the session still has a previous role, proceed directly to auth.
      // Otherwise ask the user to select a role.
      if (session.roleArn && session.principalArn && session.roleName && session.accountId) {
        frontend.searchParams.set('auth', 'true');
      } else {
        frontend.searchParams.set('select-role', 'true');
      }

    } else {
      frontend.searchParams.set('auth', 'true');

      let role = roles[0];
      session.showRole = false;
      session.roleArn = role.roleArn;
      session.roleName = role.roleName;
      session.principalArn = role.principalArn;
      session.accountId = role.accountId;
    }

    res.redirect(frontend);
  });

  return router;
};
