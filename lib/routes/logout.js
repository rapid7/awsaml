'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app) => {
  router.get('/', (req, res) => {
    app.set('entryPointUrl', null);
    if (req.session) {
      req.session.destroy();
    }
    res.redirect(app.get('configureUrl'));
  });

  return router;
};
