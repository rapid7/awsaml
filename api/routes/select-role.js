const express = require('express');

const router = express.Router();

module.exports = () => {
  router.get('/', (req, res) => {
    const session = req.session.passport;

    if (!session) {
      return res.status(401).json({
        error: 'Invalid session',
      });
    }

    res.json({
      roles: session.roles,
    });
  });

  router.post('/', (req, res) => {
    const session = req.session.passport;

    if (!session) {
      return res.status(401).json({
        error: 'Invalid session',
      });
    }

    if (!req.body.index) {
      return res.status(422).json({
        error: 'Missing role',
      });
    }

    const role = session.roles[req.body.index];

    session.showRole = true;
    session.roleArn = role.roleArn;
    session.roleName = role.roleName;
    session.principalArn = role.principalArn;
    session.accountId = role.accountId;

    res.json({
      status: 'selected',
    });
  });

  return router;
};
