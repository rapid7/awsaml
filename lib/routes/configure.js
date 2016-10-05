'use strict';

const https = require('https');
const express = require('express');
const router = express.Router();

const xmldom = require('xmldom');
const xpath = require('xpath.js');
const config = require('../../config');

const HTTP_OK = 200;

const Errors = {
  urlInvalidErr: 'The SAML metadata URL is invalid.',
  invalidMetadataErr: 'The SAML metadata is invalid.'
};
const ResponseObj = require('./../response');

module.exports = (app, auth) => {
  router.get('/', (req, res) => {
    // We populate the value of the metadata url field on the following (in order of precedence):
    //   1. Use the current session's metadata url (may have been rejected).
    //   2. Use the latest validated metadata url.
    //   3. Support the <= v1.3.0 storage key.
    //   4. Default the metadata url to empty string.
    const previousMetadataUrl =
      app.get('metadataUrl') ||
      Storage.get('previousMetadataUrl') ||
      Storage.get('metadataUrl') ||
      '';
    const storedMetadataUrls = Storage.get('metadataUrls') || {};

    res.render('configure', Object.assign(ResponseObj, {
      metadataUrl: previousMetadataUrl,
      metadataUrls: storedMetadataUrls,
      metadataUrlValid: Storage.get('metadataUrlValid'),
      error: Storage.get('metadataUrlError')
    }));
  });

  router.post('/', (req, res) => {
    const metadataUrl = req.body.metadataUrl;
    const metaDataResponseObj = Object.assign(ResponseObj, {metadataUrl});

    app.set('metadataUrl', metadataUrl);

    const xmlReq = https.get(metadataUrl, (xmlRes) => {
      let xml = '';

      if (xmlRes.statusCode !== HTTP_OK) {
        Storage.set('metadataUrlValid', false);
        Storage.set('metadataUrlError', Errors.urlInvalidErr);

        res.render('configure', Object.assign(metaDataResponseObj, {
          metadataUrlValid: false,
          error: Errors.urlInvalidErr
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
          let metadataUrls = Storage.get('metadataUrls') || {};

          if (!metadataUrls.hasOwnProperty(metadataUrl)) {
            metadataUrls[metadataUrl] = metadataUrl

            Storage.set('metadataUrls', metadataUrls);
          }

          app.set('entryPointUrl', config.auth.entryPoint);
          auth.configure(config.auth);
          res.redirect(config.auth.entryPoint);
        } else {
          res.render('configure', Object.assign(metaDataResponseObj, {
            error: Errors.invalidMetadataErr
          }));
        }
      });
    });

    xmlReq.on('error', (err) => {
      res.render('configure', Object.assign(metaDataResponseObj, {
        error: err.message
      }));
    });
  });

  return router;
};
