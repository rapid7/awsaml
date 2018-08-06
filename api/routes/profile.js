const express = require('express');
const url = require('url');

const router = express.Router();

module.exports = () => {
  router.delete('/', (req, res) => {
    let {profileUuid} = url.parse(req.url, true).query;
    let metadataUrls = Storage.get('metadataUrls');

    metadataUrls = metadataUrls.map((metadata) =>
      (metadata.profileUuid !== profileUuid) ? metadata : null
    ).filter((el) => !!el);
    Storage.set('metadataUrls', metadataUrls);

    res.status(200).end();
  });

  return router;
};
