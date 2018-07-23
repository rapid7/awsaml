const express = require('express');
const url = require('url');

const router = express.Router();

module.exports = () => {
  router.delete('/', (req, res) => {
    let {profile} = url.parse(req.url, true).query;
    let idx = parseInt(profile, 10);
    let metadataUrls = Storage.get('metadataUrls');

    metadataUrls = metadataUrls.map((metadataUrl, i) => (i !== idx) ? metadataUrl : null).filter((el) => !!el);
    Storage.set('metadataUrls', metadataUrls);

    res.status(200).end();
  });

  return router;
};
