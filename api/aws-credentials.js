const ini = require('ini');
const fs = require('fs');
const path = require('path');

class AwsCredentials {
  save(credentials, profile, done, region) {
    this.saveAsIniFile(credentials, profile, done, region);
  }

  saveSync(credentials, profile, region) {
    const done = (err) => {
      if (err) {
        throw err;
      }
    };
    this.saveAsIniFile(credentials, profile, done, region);
  }

  // eslint-disable-next-line class-methods-use-this, consistent-return
  saveAsIniFile(credentials, profile, done, region = '') {
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

    try {
      fs.mkdirSync(path.join(home, '.aws'), {
        recursive: true,
        mode: '0700',
      });
    } catch (e) {
      return done(e);
    }

    let data;
    try {
      data = fs.readFileSync(configFile, {
        encoding: 'utf8',
      });
    } catch (error) {
      if (error.code !== 'ENOENT') {
        return done(error);
      }
    }

    let config = Object.create(null);

    if (data && data !== '') {
      config = ini.parse(data);
    }

    config[profile] = {
      aws_access_key_id: credentials.AccessKeyId,
      aws_secret_access_key: credentials.SecretAccessKey,
      aws_session_token: credentials.SessionToken,
      // Some libraries e.g. boto v2.38.0, expect an "aws_security_token" entry.
      aws_security_token: credentials.SessionToken,
    };

    if (region.includes('gov')) {
      config[profile].region = region;
    }

    config = ini.encode(config, {
      whitespace: true,
    });

    fs.writeFile(configFile, config, 'utf8', done);
  }

  static resolveHomePath() {
    const {
      env,
    } = process;

    return env.HOME
      || env.USERPROFILE
      || (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null);
  }
}

module.exports = AwsCredentials;
