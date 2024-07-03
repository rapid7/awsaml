import Path from 'path';
import FS from 'fs';
import ini from 'ini';
import AwsCredentials from '../src/main/api/aws-credentials';

describe('AwsCredentials#saveAsIniFile', () => {
  const awsFolder = Path.resolve(__dirname, '.aws');
  const awsCredentials = Path.resolve(awsFolder, 'credentials');

  beforeEach(() => {
    if (FS.existsSync(awsCredentials)) {
      FS.unlinkSync(awsCredentials);
    }

    if (FS.existsSync(awsFolder)) {
      FS.rmdirSync(awsFolder);
    }
  });

  it('returns an error when credentials are null', (done) => {
    const aws = new AwsCredentials();

    aws.saveAsIniFile(null, 'profile', (error) => {
      expect(error.toString()).not.toEqual('');
      done();
    });
  });

  it('returns an error when profile is null', (done) => {
    const aws = new AwsCredentials();

    aws.saveAsIniFile({}, null, (error) => {
      expect(error.toString()).not.toEqual('');
      done();
    });
  });

  it('returns an error when $HOME path is unresolved', (done) => {
    const aws = new AwsCredentials();

    delete process.env.HOME;
    delete process.env.USERPROFILE;
    delete process.env.HOMEPATH;
    delete process.env.HOMEDRIVE;

    aws.saveAsIniFile({}, 'profile', (error) => {
      expect(error.toString()).not.toEqual('');
      done();
    });
  });

  it('returns an error when $HOME path is empty', (done) => {
    const aws = new AwsCredentials();

    process.env.HOME = '';

    aws.saveAsIniFile({}, 'profile', (error) => {
      expect(error.toString()).not.toEqual('');
      done();
    });
  });

  it('creates a $HOME/.aws folder when none exists', (done) => {
    const aws = new AwsCredentials();

    process.env.HOME = __dirname;

    aws.saveAsIniFile({}, 'profile', (error) => {
      expect(FS.existsSync(awsFolder)).toBe(true);
      expect(error).toBeNull();
      done();
    });
  });

  it('creates a $HOME/.aws folder with 0700 permissions', (done) => {
    const aws = new AwsCredentials();

    process.env.HOME = __dirname;

    aws.saveAsIniFile({}, 'profile', (error) => {
      expect(FS.statSync(awsFolder).mode & 0x0700).toEqual(256); // eslint-disable-line no-bitwise
      expect(error).toBeNull();
      done();
    });
  });

  it('saves the access key in the credentials file', (done) => {
    const aws = new AwsCredentials();
    const credentials = {
      AccessKeyId: 'AccessKeyId',
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', (error) => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      expect(error).toBeNull();
      expect(config.profile.aws_access_key_id).toEqual(credentials.AccessKeyId);
      done();
    });
  });

  it('saves the secret key in the credentials file', (done) => {
    const aws = new AwsCredentials();
    const credentials = {
      SecretAccessKey: 'SecretAccessKey',
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', (error) => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      expect(error).toBeNull();
      expect(config.profile.aws_secret_access_key).toEqual(credentials.SecretAccessKey);
      done();
    });
  });

  it('saves the session token in the credentials file', (done) => {
    const aws = new AwsCredentials();
    const credentials = {
      SessionToken: 'SessionToken',
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', (error) => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      expect(error).toBeNull();
      expect(config.profile.aws_session_token).toEqual(credentials.SessionToken);
      done();
    });
  });

  it(
    'saves the session token as a security token in the credentials file',
    (done) => {
      const aws = new AwsCredentials();
      const credentials = {
        SessionToken: 'SessionToken',
      };

      process.env.HOME = __dirname;

      aws.saveAsIniFile(credentials, 'profile', (error) => {
        const data = FS.readFileSync(awsCredentials, 'utf-8');
        const config = ini.parse(data);

        expect(error).toBeNull();
        expect(config.profile.aws_security_token).toEqual(credentials.SessionToken);
        done();
      });
    },
  );

  it('saves the expiration in the credentials file if it exists', (done) => {
    const aws = new AwsCredentials();
    const credentials = {
      AccessKeyId: 'AccessKeyId',
      SecretAccessKey: 'SecretAccessKey',
      SessionToken: 'SessionToken',
      Expiration: new Date().toISOString(),
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', () => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      expect(config.profile).toEqual({
        aws_access_key_id: credentials.AccessKeyId,
        aws_secret_access_key: credentials.SecretAccessKey,
        aws_security_token: credentials.SessionToken,
        aws_session_token: credentials.SessionToken,
        expiration: credentials.Expiration,
      });

      done();
    });
  });

  it('keeps existing profiles', (done) => {
    const aws = new AwsCredentials();
    const credentials1 = {
      AccessKeyId: 'AccessKeyId1',
      SecretAccessKey: 'SecretAccessKey1',
      SessionToken: 'SessionToken1',
    };
    const credentials2 = {
      AccessKeyId: 'AccessKeyId2',
      SecretAccessKey: 'SecretAccessKey2',
      SessionToken: 'SessionToken2',
    };
    const credentials3 = {
      AccessKeyId: 'AccessKeyId3',
      SecretAccessKey: 'SecretAccessKey3',
      SessionToken: 'SessionToken3',
      Expiration: new Date().toISOString(),
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials1, 'profile1', () => {
      aws.saveAsIniFile(credentials2, 'profile2', () => {
        aws.saveAsIniFile(credentials3, 'profile3', () => {
          const data = FS.readFileSync(awsCredentials, 'utf-8');
          const config = ini.parse(data);

          expect(config.profile1).toEqual({
            aws_access_key_id: credentials1.AccessKeyId,
            aws_secret_access_key: credentials1.SecretAccessKey,
            aws_security_token: credentials1.SessionToken,
            aws_session_token: credentials1.SessionToken,
          });
          expect(config.profile2).toEqual({
            aws_access_key_id: credentials2.AccessKeyId,
            aws_secret_access_key: credentials2.SecretAccessKey,
            aws_security_token: credentials2.SessionToken,
            aws_session_token: credentials2.SessionToken,
          });

          expect(config.profile3).toEqual({
            aws_access_key_id: credentials3.AccessKeyId,
            aws_secret_access_key: credentials3.SecretAccessKey,
            aws_security_token: credentials3.SessionToken,
            aws_session_token: credentials3.SessionToken,
            expiration: credentials3.Expiration,
          });

          done();
        });
      });
    });
  });
});

describe('AwsCredentials#resolveHomePath', () => {
  beforeEach(() => {
    delete process.env.HOME;
    delete process.env.USERPROFILE;
    delete process.env.HOMEPATH;
    delete process.env.HOMEDRIVE;
  });

  it(
    'returns null if $HOME, $USERPROFILE, and $HOMEPATH are undefined',
    () => {
      expect(AwsCredentials.resolveHomePath()).toBeNull();
    },
  );

  it('uses $HOME if defined', () => {
    process.env.HOME = 'HOME';

    expect(AwsCredentials.resolveHomePath()).toEqual('HOME');
  });

  it('uses $USERPROFILE if $HOME is undefined', () => {
    process.env.USERPROFILE = 'USERPROFILE';

    expect(AwsCredentials.resolveHomePath()).toEqual('USERPROFILE');
  });

  it('uses $HOMEPATH if $HOME and $USERPROFILE are undefined', () => {
    process.env.HOMEPATH = 'HOMEPATH';

    expect(AwsCredentials.resolveHomePath()).toEqual('C:/HOMEPATH');
  });

  it('uses $HOMEDRIVE with $HOMEPATH if defined', () => {
    process.env.HOMEPATH = 'HOMEPATH';
    process.env.HOMEDRIVE = 'D:/';

    expect(AwsCredentials.resolveHomePath()).toEqual('D:/HOMEPATH');
  });
});
