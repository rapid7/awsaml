const https = require('node:https');
const { v4: uuidv4 } = require('uuid');
const { DOMParser } = require('@xmldom/xmldom');
const xpath = require('xpath.js');

const {
  app,
  auth,
} = require('../api/server');
const ResponseObj = require('../api/response');
const config = require('../api/config.json');

const Errors = {
  invalidMetadataErr: 'The SAML metadata is invalid.',
  urlInvalidErr: 'The SAML metadata URL is invalid.',
  uuidInvalidError: 'The profile is invalid.',
};

async function getMetadataUrls() {
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

  return storedMetadataUrls;
}

async function getDefaultMetadata() {
  const storedMetadataUrls = (Storage.get('metadataUrls') || []);

  let defaultMetadataName = app.get('profileName') || '';

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

  return {
    url: defaultMetadataUrl,
    name: defaultMetadataName,
  };
}

async function asyncHttpsGet(url) {
  return new Promise((resolve, reject) => {
    let data = '';

    // eslint-disable-next-line consistent-return
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(res);
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        resolve(data);
      });
    });
  });
}

async function deleteProfile(event, payload) {
  const {
    profileUuid,
  } = payload;

  let metadataUrls = Storage.get('metadataUrls');

  metadataUrls = metadataUrls
    .map((metadata) => ((metadata.profileUuid !== profileUuid) ? metadata : null))
    .filter((el) => !!el);
  Storage.set('metadataUrls', metadataUrls);

  return {};
}

async function getProfile(event, payload) {
  const {
    profileUuid,
  } = payload;

  const metadataUrls = Storage.get('metadataUrls');
  const profile = metadataUrls.find((el) => el.profileUuid === profileUuid);

  return {
    profile,
  };
}

async function login(event, payload) {
  const {
    profileUuid,
    profileName,
    metadataUrl,
  } = payload;

  let storedMetadataUrls = Storage.get('metadataUrls') || [];
  let profile;

  if (!metadataUrl) {
    Storage.set('metadataUrlValid', false);
    Storage.set('metadataUrlError', Errors.urlInvalidErr);

    return {
      ...ResponseObj,
      error: Errors.urlInvalidErr,
      metadataUrlValid: false,
    };
  }

  // If a profileUuid is passed, validate it and update storage
  // with the submitted profile name.
  if (profileUuid) {
    profile = storedMetadataUrls.find((metadata) => metadata.profileUuid === profileUuid);

    if (!profile) {
      return {
        ...ResponseObj,
        error: Errors.uuidInvalidError,
        uuidUrlValid: false,
      };
    }

    if (profile.url !== metadataUrl) {
      return {
        ...ResponseObj,
        error: Errors.urlInvalidErr,
        metadataUrlValid: false,
      };
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

  const metaDataResponseObj = {
    ...ResponseObj,
    defaultMetadataName: profileName,
    defaultMetadataUrl: metadataUrl,
  };

  let data;
  try {
    data = await asyncHttpsGet(metadataUrl);
  } catch (e) {
    Storage.set('metadataUrlValid', false);
    Storage.set('metadataUrlError', Errors.urlInvalidErr);

    return {
      ...metaDataResponseObj,
      error: Errors.urlInvalidErr,
      metadataUrlValid: false,
    };
  }

  Storage.set('metadataUrlValid', true);
  Storage.set('metadataUrlError', null);

  const xmlDoc = new DOMParser().parseFromString(data, 'text/xml');
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
  app.set('lastEntryPointLoad', new Date());

  if (!cert || !issuer || !entryPoint) {
    return {
      ...metaDataResponseObj,
      error: Errors.invalidMetadataErr,
    };
  }

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

  return {
    redirect: config.auth.entryPoint,
  };
}

async function isAuthenticated() {
  return Storage.get('authenticated') || false;
}

async function hasMultipleRoles() {
  return Storage.get('multipleRoles') || false;
}

module.exports = {
  getMetadataUrls,
  getDefaultMetadata,
  login,
  deleteProfile,
  getProfile,
  isAuthenticated,
  hasMultipleRoles,
};
