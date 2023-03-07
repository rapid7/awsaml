const https = require('https');
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { DOMParser } = require('@xmldom/xmldom');
const xpath = require('xpath.js');
const config = require('../config.json');

const router = express.Router();
const HTTP_OK = 200;

const Errors = {
  invalidMetadataErr: 'The SAML metadata is invalid.',
  urlInvalidErr: 'The SAML metadata URL is invalid.',
  uuidInvalidError: 'The profile is invalid.',
};
const ResponseObj = require('../response');

module.exports = (app, auth) => {
  router.get('/', (req, res) => {
    // Migrate metadataUrls to include a profileUuid.  This makes
    // profile deletes/edits a little safer since they will no longer be
    // based on the iteration index.
    let migrated = false;
    const storedMetadataUrls = (Storage.get('metadataUrls') || []).map((metadata) => {
      const ret = {
        ...metadata,
      };
      if (metadata.profileUuid === undefined) {
        migrated = true;
        ret.profileUuid = uuidv4();
      }

      return metadata;
    });

    if (migrated) {
      Storage.set('metadataUrls', storedMetadataUrls);
    }

    let defaultMetadataName = app.get('profileName')
      || '';

    // We populate the value of the metadata url field on the following (in order of precedence):
    //   1. Use the current session's metadata url (may have been rejected).
    //   2. Use the latest validated metadata url.
    //   3. Support the <= v1.3.0 storage key.
    //   4. Default the metadata url to empty string.
    let defaultMetadataUrl = app.get('metadataUrl')
      || Storage.get('previousMetadataUrl')
      || Storage.get('metadataUrl')
      || '';

    if (!defaultMetadataUrl) {
      if (storedMetadataUrls.length > 0) {
        const defaultMetadata = storedMetadataUrls[0];
        if (Object.prototype.hasOwnProperty.call(defaultMetadata, 'url')) {
          defaultMetadataUrl = defaultMetadata.url;
        }
        if (Object.prototype.hasOwnProperty.call(defaultMetadata, 'name')) {
          defaultMetadataName = defaultMetadata.name;
        }
      }
    }

    res.json({
      ...ResponseObj,
      defaultMetadataName,
      defaultMetadataUrl,
      error: Storage.get('metadataUrlError'),
      metadataUrlValid: Storage.get('metadataUrlValid'),
      metadataUrls: storedMetadataUrls,
    });
  });

  // eslint-disable-next-line consistent-return
  router.post('/', (req, res) => {
    const {
      profileUuid,
      profileName,
      metadataUrl,
    } = req.body;
    let storedMetadataUrls = Storage.get('metadataUrls') || [];
    let profile;

    if (!metadataUrl) {
      Storage.set('metadataUrlValid', false);
      Storage.set('metadataUrlError', Errors.urlInvalidErr);

      return res.json({
        ...ResponseObj,
        error: Errors.urlInvalidErr,
        metadataUrlValid: false,
      });
    }

    // If a profileUuid is passed, validate it and update storage
    // with the submitted profile name.
    if (profileUuid) {
      profile = storedMetadataUrls.find((metadata) => metadata.profileUuid === profileUuid);

      if (!profile) {
        return res.status(404).json({
          ...ResponseObj,
          error: Errors.uuidInvalidError,
          uuidUrlValid: false,
        });
      }

      if (profile.url !== metadataUrl) {
        return res.status(422).json({
          ...ResponseObj,
          error: Errors.urlInvalidErr,
          metadataUrlValid: false,
        });
      }

      if (profileName) {
        storedMetadataUrls = storedMetadataUrls.map((metadata) => {
          const ret = {
            ...metadata,
          };

          if (metadata.profileUuid === profileUuid && metadata.name !== profileName) {
            ret.name = profileName;
          }

          return ret;
        });
        Storage.set('metadataUrls', storedMetadataUrls);
      }
    } else {
      profile = storedMetadataUrls.find((metadata) => metadata.url === metadataUrl);
    }

    app.set('metadataUrl', metadataUrl);
    app.set('profileName', profileName);

    const {
      origin,
    } = req.body;

    const metaDataResponseObj = {
      ...ResponseObj,
      defaultMetadataName: profileName,
      defaultMetadataUrl: metadataUrl,
    };

    const xmlReq = https.get(metadataUrl, (xmlRes) => {
      let xml = '';

      if (xmlRes.statusCode !== HTTP_OK) {
        Storage.set('metadataUrlValid', false);
        Storage.set('metadataUrlError', Errors.urlInvalidErr);

        res.json({
          ...metaDataResponseObj,
          error: Errors.urlInvalidErr,
          metadataUrlValid: false,
        });

        return;
      }
      Storage.set('metadataUrlValid', true);
      Storage.set('metadataUrlError', null);

      xmlRes.on('data', (chunk) => {
        xml += chunk;
      });

      xmlRes.on('end', () => {
        const xmlDoc = new DOMParser().parseFromString(xml, 'text/xml');
        const safeXpath = (doc, p) => {
          try {
            return xpath(doc, p);
          } catch (_) {
            return null;
          }
        };

        let cert = safeXpath(xmlDoc, '//*[local-name(.)=\'X509Certificate\']/text()');
        let issuer = safeXpath(xmlDoc, '//*[local-name(.)=\'EntityDescriptor\']/@entityID');
        let entryPoint = safeXpath(xmlDoc, '//*[local-name(.)=\'SingleSignOnService\' and'
                + ' @Binding=\'urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST\']/@Location');

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

          // Add a profile for this URL if one does not already exist
          if (!profile) {
            const metadataUrls = Storage.get('metadataUrls') || [];

            Storage.set(
              'metadataUrls',
              metadataUrls.concat([
                {
                  name: profileName || metadataUrl,
                  profileUuid: uuidv4(),
                  url: metadataUrl,
                },
              ]),
            );
          }

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
          res.json({
            ...metaDataResponseObj,
            error: Errors.invalidMetadataErr,
          });
        }
      });
    });

    xmlReq.on('error', (err) => {
      res.json({
        ...metaDataResponseObj,
        error: err.message,
      });
    });
  });

  return router;
};
