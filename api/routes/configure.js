const https = require('https');
const express = require('express');
const uuidv4 = require('uuid/v4');
const xmldom = require('xmldom');
const xpath = require('xpath.js');
const config = require('../config');

const router = express.Router();
const HTTP_OK = 200;

const Errors = {
  invalidMetadataErr: 'The SAML metadata is invalid.',
  urlInvalidErr: 'The SAML metadata URL is invalid.',
};
const ResponseObj = require('./../response');

module.exports = (app, auth) => {
  router.get('/', (req, res) => {
    const storedMetadataUrls = Storage.get('metadataUrls') || [];

    // Migrate metadataUrls to include a profileUuid.  This makes
    // profile deletes/edits a little safer since they will no longer be
    // based on the iteration index.
    let migrated = false;

    storedMetadataUrls.forEach((metadata) => {
      if (metadata.profileUuid === undefined) {
        migrated = true;
        metadata.profileUuid = uuidv4();
      }
    });
    if (migrated) {
      Storage.set('metadataUrls', storedMetadataUrls);
    }

    // We populate the value of the metadata url field on the following (in order of precedence):
    //   1. Use the current session's metadata url (may have been rejected).
    //   2. Use the latest validated metadata url.
    //   3. Support the <= v1.3.0 storage key.
    //   4. Default the metadata url to empty string.
    let defaultMetadataUrl =
      app.get('metadataUrl')
      || Storage.get('previousMetadataUrl')
      || Storage.get('metadataUrl')
      || '';

    if (!defaultMetadataUrl) {
      if (storedMetadataUrls.length > 0 && storedMetadataUrls[0].hasOwnProperty('url')) {
        defaultMetadataUrl = storedMetadataUrls[0].url;
      }
    }

    res.json(Object.assign({}, ResponseObj, {
      defaultMetadataUrl,
      error: Storage.get('metadataUrlError'),
      metadataUrlValid: Storage.get('metadataUrlValid'),
      metadataUrls: storedMetadataUrls,
    }));
  });

  router.post('/', (req, res) => {
    const metadataUrl = req.body.metadataUrl;

    if (!metadataUrl) {
      Storage.set('metadataUrlValid', false);
      Storage.set('metadataUrlError', Errors.urlInvalidErr);

      return res.json(Object.assign({}, ResponseObj, {
        error: Errors.urlInvalidErr,
        metadataUrlValid: false,
      }));
    }

    const origin = req.body.origin;
    const metaDataResponseObj = Object.assign({}, ResponseObj, {defaultMetadataUrl: metadataUrl});

    let storedMetadataUrls = Storage.get('metadataUrls') || [];
    const profileName = req.body.profileName === '' ? metadataUrl : req.body.profileName;
    const profile = storedMetadataUrls.find((profile) => profile.url === metadataUrl);

    storedMetadataUrls = storedMetadataUrls.map((storedMetadataUrl) => {
      if (profileName && storedMetadataUrl.url === metadataUrl && storedMetadataUrl.name !== profileName) {
        storedMetadataUrl.name = profileName;
      }

      return storedMetadataUrl;
    });
    Storage.set('metadataUrls', storedMetadataUrls);
    app.set('metadataUrl', metadataUrl);

    const xmlReq = https.get(metadataUrl, (xmlRes) => {
      let xml = '';

      if (xmlRes.statusCode !== HTTP_OK) {
        Storage.set('metadataUrlValid', false);
        Storage.set('metadataUrlError', Errors.urlInvalidErr);

        res.json(Object.assign({}, metaDataResponseObj, {
          error: Errors.urlInvalidErr,
          metadataUrlValid: false,
        }));

        return;
      }
      Storage.set('metadataUrlValid', true);
      Storage.set('metadataUrlError', null);

      xmlRes.on('data', (chunk) => {
        xml += chunk;
      });

      xmlRes.on('end', () => {
        const xmlDoc = new xmldom.DOMParser().parseFromString(xml);
        const safeXpath = (doc, p) => {
          try {
            return xpath(doc, p);
          } catch (_) {
            return null;
          }
        };

        let cert = safeXpath(xmlDoc, '//*[local-name(.)=\'X509Certificate\']/text()'),
            issuer = safeXpath(xmlDoc, '//*[local-name(.)=\'EntityDescriptor\']/@entityID'),
            entryPoint = safeXpath(xmlDoc, '//*[local-name(.)=\'SingleSignOnService\' and' +
                ' @Binding=\'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\']/@Location');

        if (cert) {
          cert = cert.length ? cert[0].data.replace(/\s+/g, '') : null;
        }
        config.auth.cert = cert;

        if (issuer) {
          issuer = issuer.length ? issuer[0].value : null;
        }
        config.auth.issuer = issuer;

        if (entryPoint) {
          entryPoint = entryPoint.length ? entryPoint[0].value : null;
        }
        config.auth.entryPoint = entryPoint;

        if (cert && issuer && entryPoint) {
          Storage.set('previousMetadataUrl', metadataUrl);
          const metadataUrls = Storage.get('metadataUrls') || [];

          Storage.set(
            'metadataUrls',
            profile ? metadataUrls : metadataUrls.concat([
              {
                name: profileName || metadataUrl,
                profileUuid: uuidv4(),
                url: metadataUrl,
              },
            ])
          );

          app.set('entryPointUrl', config.auth.entryPoint);
          auth.configure(config.auth);
          if (origin === 'electron') {
            res.redirect(config.auth.entryPoint);
          } else {
            res.json({
              redirect: config.auth.entryPoint,
            });
          }
        } else {
          res.json(Object.assign({}, metaDataResponseObj, {
            error: Errors.invalidMetadataErr,
          }));
        }
      });
    });

    xmlReq.on('error', (err) => {
      res.json(Object.assign({}, metaDataResponseObj, {
        error: err.message,
      }));
    });
  });

  return router;
};
