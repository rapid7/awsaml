'use strict';

const express = require('express');
const router = express.Router();

module.exports = (app) => {
  router.get('/', (req, res) => {
    clearInterval(app.get('tokenRefreshInterval'));
    req.session.destroy();
    res.redirect(app.get('configureUrl'));
  });

  return router;
};
