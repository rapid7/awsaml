const {
  getMetadataUrls,
  getDefaultMetadata,
  login,
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
      'configure:defaultMetadata:get': getDefaultMetadata,
      'configure:profile:delete': deleteProfile,
      'configure:profile:get': getProfile,
      'configure:login': login,
      'select-role:get': getRoles,
      'select-role:set': setRole,
      'logout:get': logout,
      'refresh:get': refresh,
    },
  },
};
