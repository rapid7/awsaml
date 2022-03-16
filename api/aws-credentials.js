const ini = require('ini');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');

class AwsCredentials {
  save(credentials, profile, done, region) {
    this.saveAsIniFile(credentials, profile, done, region);
  }

  saveAsIniFile(credentials, profile, done, region = "") {
    const home = AwsCredentials.resolveHomePath();

    if (!home) {
      return done(new Error('Cannot save AWS credentials, HOME path not set'));
    }

    const configFile = path.join(home, '.aws', 'credentials');

    if (!credentials) {
      return done(new Error('Invalid AWS credentials'));
    }

    if (!profile) {
      return done(new Error('Cannot save AWS credentials, profile not set'));
    }

    // mkdirp is a no-op if the directory already exists
    mkdirp(path.join(home, '.aws'), '0700', (mkDirErr) => {
      if (mkDirErr) {
        return done(mkDirErr);
      }

      fs.readFile(configFile, 'utf8', (fsErr, data) => {
        if (fsErr && fsErr.code !== 'ENOENT') {
          return done(fsErr);
        }

        let config = Object.create(null);

        if (data && data !== '') {
          config = ini.parse(data);
        }

        config[profile] = {};
        config[profile].aws_access_key_id = credentials.AccessKeyId;
        config[profile].aws_secret_access_key = credentials.SecretAccessKey;
        config[profile].aws_session_token = credentials.SessionToken;
        if (region.includes("gov"))
          config[profile].region = region
        // Some libraries e.g. boto v2.38.0, expect an "aws_security_token" entry.
        config[profile].aws_security_token = credentials.SessionToken;
        config = ini.encode(config, {whitespace: true});

        fs.writeFile(configFile, config, 'utf8', done);
      });
    });
  }

  static resolveHomePath() {
    const env = process.env;

    return env.HOME
      || env.USERPROFILE
      || (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null);
  }
}

module.exports = AwsCredentials;
