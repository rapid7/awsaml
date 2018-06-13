const express = require('express');
const url = require('url');
const router = express.Router();

module.exports = (app) => {
  router.delete('/', (req, res) => {
    let {profile} = url.parse(req.url, true).query;
    let idx = parseInt(profile, 10);

    let metadataUrls = Storage.get('metadataUrls');
    metadataUrls = metadataUrls.map((metadataUrl, i) => {
      if (i !== idx) {
        return metadataUrl;
      }
    }).filter((el) => !!el);

    Storage.set('metadataUrls', metadataUrls);

    res.status(200).end();
  });

  return router;
};
