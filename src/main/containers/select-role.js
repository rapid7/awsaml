async function getRoles() {
  const session = Storage.get('session');

  if (!session) {
    return {
      error: 'Invalid session',
    };
  }

  return {
    roles: session.roles,
  };
}

async function setRole(event, payload) {
  const session = Storage.get('session');

  if (!session) {
    return {
      error: 'Invalid session',
    };
  }

  const {
    index,
  } = payload;

  if (index === undefined) {
    return {
      error: 'Missing role',
    };
  }

  const role = session.roles[index];

  session.showRole = true;
  session.roleArn = role.roleArn;
  session.roleName = role.roleName;
  session.principalArn = role.principalArn;
  session.accountId = role.accountId;

  Storage.set('session', session);
  Storage.set('multipleRoles', false);

  return {
    status: 'selected',
  };
}

module.exports = {
  getRoles,
  setRole,
};
