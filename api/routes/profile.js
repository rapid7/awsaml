const express = require('express');

const router = express.Router();

module.exports = () => {
  router.delete('/', (req, res) => {
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const url = new URL(req.url, `${req.protocol}://${req.headers.host}/`);
    const profileUuid = url.searchParams.get('profileUuid');
    let metadataUrls = Storage.get('metadataUrls');

    metadataUrls = metadataUrls
      .map((metadata) => ((metadata.profileUuid !== profileUuid) ? metadata : null))
      .filter((el) => !!el);
    Storage.set('metadataUrls', metadataUrls);

    res.status(200).end();
  });

  return router;
};
