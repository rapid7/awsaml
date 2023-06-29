const url = require('node:url');

function authHandler(app) {
  return async (req, res) => {
    let roleAttr = req.user['https://aws.amazon.com/SAML/Attributes/Role'];
    let frontend = app.get('baseUrl');

    frontend = new url.URL(frontend);

    // Convert roleAttr to an array if it isn't already one
    if (!Array.isArray(roleAttr)) {
      roleAttr = [roleAttr];
    }

    const roles = roleAttr.map((arns, i) => {
      const [roleArn, principalArn] = arns.split(',');
      const roleArnSegments = roleArn.split(':');
      const accountId = roleArnSegments[4];
      const roleName = roleArnSegments[5].replace('role/', '');

      return {
        accountId,
        index: i,
        principalArn,
        roleArn,
        roleName,
      };
    });

    const session = req.session.passport;

    session.samlResponse = req.body.SAMLResponse;
    session.roles = roles;

    if (roles.length > 1) {
      // If the session has a previous role, see if it matches
      // the latest roles from the current SAML assertion.  If it
      // doesn't match, wipe it from the session.
      if (session.roleArn && session.principalArn) {
        const found = roles
          // eslint-disable-next-line max-len
          .find((role) => role.roleArn === session.roleArn && role.principalArn === session.principalArn);

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
        Storage.set('authenticated', true);
      } else {
        Storage.set('multipleRoles', true);
      }
    } else {
      const role = roles[0];

      Storage.set('authenticated', true);

      session.showRole = false;
      session.roleArn = role.roleArn;
      session.roleName = role.roleName;
      session.principalArn = role.principalArn;
      session.accountId = role.accountId;
    }

    Storage.set('session', session);

    res.redirect(frontend);
  };
}

module.exports = {
  authHandler,
};
