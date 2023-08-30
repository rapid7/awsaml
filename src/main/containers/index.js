const {
  getMetadataUrls,
  setMetadataUrls,
  getDefaultMetadata,
  login,
  isAuthenticated,
  hasMultipleRoles,
  getProfile,
  deleteProfile,
} = require('./configure');

const {
  setRole,
  getRoles,
} = require('./select-role');

const {
  logout,
} = require('./logout');

const {
  refresh,
} = require('./refresh');

module.exports = {
  channels: {
    configure: {
      'configure:metadataUrls:get': getMetadataUrls,
      'configure:metadataUrls:set': setMetadataUrls,
      'configure:defaultMetadata:get': getDefaultMetadata,
      'configure:profile:delete': deleteProfile,
      'configure:profile:get': getProfile,
      'configure:login': login,
      'configure:is-authenticated': isAuthenticated,
      'configure:has-multiple-roles': hasMultipleRoles,
    },
    'select-role': {
      'select-role:get': getRoles,
      'select-role:set': setRole,
    },
    logout: {
      'logout:get': logout,
    },
    refresh: {
      'refresh:get': refresh,
    },
  },
};
