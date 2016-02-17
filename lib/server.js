'use strict';

const HTTP_OK = 200;

const path = require('path');
const https = require('https');

const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const errorHandler = require('errorhandler');

const Aws = require('aws-sdk');
const xmldom = require('xmldom');
const xpath = require('xpath.js');

const config = require('../config');
const Auth = require('../lib/auth');
const AwsCredentials = require('../lib/aws-credentials');
const Storage = require('../lib/storage');

const sessionSecret = '491F9BAD-DFFF-46E2-A0F9-56397B538060';

const auth = new Auth(config.auth);
const credentials = new AwsCredentials(config.aws);
const app = express();

app.set('host', config.server.host);
app.set('port', config.server.port);
app.set('configureUrl', `http://${config.server.host}:${config.server.port}/configure`);
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'jsx');
app.engine('jsx', require('express-react-views').createEngine());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(morgan('dev'));
app.use(cookieParser(sessionSecret));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSession({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true
}));
app.use(auth.initialize());
app.use(auth.session());

const Errors = {
  urlInvalidErr: 'The SAML metadata URL is invalid.',
  invalidMetadataErr: 'The SAML metadata is invalid.'
};

const ResponseObj = {
  title: 'Rapid7 - Awsaml',
  platform: process.platform
};

app.post(config.auth.path, auth.authenticate('saml', {
  failureRedirect: app.get('configureUrl'),
  failureFlash: true
}), (req, res) => {
  const arns = req.user['https://aws.amazon.com/SAML/Attributes/Role'].split(',');

  /* eslint-disable no-param-reassign */
  req.session.passport.samlResponse = req.body.SAMLResponse;
  req.session.passport.roleArn = arns[0];
  req.session.passport.principalArn = arns[1];
  req.session.passport.accountId = arns[0].split(':')[4]; // eslint-disable-line rapid7/static-magic-numbers
  /* eslint-enable no-param-reassign */
  res.redirect('/refresh');
});

app.get('/configure', (req, res) => {
  let metadataUrl = Storage.get('metadataUrl');
  const metadataUrlValid = Storage.get('metadataUrlValid');
  const error = Storage.get('metadataUrlError');

  if (!metadataUrl) {
    metadataUrl = '';
  }

  res.render('configure', Object.assign(ResponseObj, {
    metadataUrl,
    metadataUrlValid,
    error
  }));
});

app.post('/configure', (req, res) => {
  const metadataUrl = req.body.metadataUrl;
  const metaDataResponseObj = Object.assign(ResponseObj, {metadataUrl});

  Storage.set('metadataUrl', metadataUrl);

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

app.all('*', auth.guard);

app.all('/refresh', (req, res) => {
  const sts = new Aws.STS();
  const session = req.session.passport;

  const refreshResponseObj = Object.assign(ResponseObj, {
    accountId: session.accountId
  });

  sts.assumeRoleWithSAML({
    PrincipalArn: session.principalArn,
    RoleArn: session.roleArn,
    SAMLAssertion: session.samlResponse,
    DurationSeconds: config.aws.duration
  }, (assumeRoleErr, data) => {
    const credentialResponseObj = Object.assign(refreshResponseObj, {
      accessKey: data.Credentials.AccessKeyId,
      secretKey: data.Credentials.SecretAccessKey,
      sessionToken: data.Credentials.SessionToken
    });

    if (assumeRoleErr) {
      res.redirect(config.auth.entryPoint);
      return;
    }

    res.render('refresh', credentialResponseObj);

    credentials.save(data.Credentials, `awsaml-${session.accountId}`, (credSaveErr) => {
      if (credSaveErr) {
        res.render('refresh', Object.assign(credentialResponseObj, {
          error: credSaveErr
        }));
      }
    });
  });
});

app.use(errorHandler());

module.exports = app;
