'use strict';

const AwsCredentials = require('../lib/aws-credentials');
const should = require('should');
const Path = require('path');
const FS = require('fs');
const ini = require('ini');

describe('AwsCredentials#saveAsIniFile', function () {
  const awsFolder = Path.resolve(__dirname, '.aws');
  const awsCredentials = Path.resolve(awsFolder, 'credentials');

  beforeEach(function () {
    if (FS.existsSync(awsCredentials)) {
      FS.unlinkSync(awsCredentials);
    }

    if (FS.existsSync(awsFolder)) {
      FS.rmdirSync(awsFolder);
    }
  });

  it('returns an error when credentials are null', function (done) {
    const aws = new AwsCredentials();

    aws.saveAsIniFile(null, 'profile', (error) => {
      error.toString().should.not.eql('');
      done();
    });
  });

  it('returns an error when profile is null', function (done) {
    const aws = new AwsCredentials();

    aws.saveAsIniFile({}, null, (error) => {
      error.toString().should.not.eql('');
      done();
    });
  });

  it('returns an error when $HOME path is unresolved', function (done) {
    const aws = new AwsCredentials();

    delete process.env.HOME;
    delete process.env.USERPROFILE;
    delete process.env.HOMEPATH;
    delete process.env.HOMEDRIVE;

    aws.saveAsIniFile({}, 'profile', (error) => {
      error.toString().should.not.eql('');
      done();
    });
  });

  it('returns an error when $HOME path is empty', function (done) {
    const aws = new AwsCredentials();

    process.env.HOME = '';

    aws.saveAsIniFile({}, 'profile', (error) => {
      error.toString().should.not.eql('');
      done();
    });
  });

  it('creates a $HOME/.aws folder when none exists', function (done) {
    const aws = new AwsCredentials();

    process.env.HOME = __dirname;

    aws.saveAsIniFile({}, 'profile', (error) => {
      should(FS.existsSync(awsFolder)).be.true();
      should(error).be.null();
      done();
    });
  });

  it('creates a $HOME/.aws folder with 0700 permissions', function (done) {
    const aws = new AwsCredentials();

    process.env.HOME = __dirname;

    aws.saveAsIniFile({}, 'profile', (error) => {
      should(FS.statSync(awsFolder).mode & 0x0700).eql(256);
      should(error).be.null();
      done();
    });
  });

  it('saves the access key in the credentials file', function (done) {
    const aws = new AwsCredentials();
    const credentials = {
      AccessKeyId: 'AccessKeyId'
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', (error) => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      should(error).be.null();
      should(config.profile.aws_access_key_id).eql(credentials.AccessKeyId);
      done();
    });
  });

  it('saves the secret key in the credentials file', function (done) {
    const aws = new AwsCredentials();
    const credentials = {
      SecretAccessKey: 'SecretAccessKey'
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', (error) => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      should(error).be.null();
      should(config.profile.aws_secret_access_key).eql(credentials.SecretAccessKey);
      done();
    });
  });

  it('saves the session token in the credentials file', function (done) {
    const aws = new AwsCredentials();
    const credentials = {
      SessionToken: 'SessionToken'
    };

    process.env.HOME = __dirname;

    aws.saveAsIniFile(credentials, 'profile', (error) => {
      const data = FS.readFileSync(awsCredentials, 'utf-8');
      const config = ini.parse(data);

      should(error).be.null();
      should(config.profile.aws_session_token).eql(credentials.SessionToken);
      done();
    });
  });
});

describe('AwsCredentials#resolveHomePath', function () {
  beforeEach(function () {
    delete process.env.HOME;
    delete process.env.USERPROFILE;
    delete process.env.HOMEPATH;
    delete process.env.HOMEDRIVE;
  });

  it('returns null if $HOME, $USERPROFILE, and $HOMEPATH are undefined', function () {
    should(AwsCredentials.resolveHomePath()).be.null();
  });

  it('uses $HOME if defined', function () {
    process.env.HOME = 'HOME';

    should(AwsCredentials.resolveHomePath()).eql('HOME');
  });

  it('uses $USERPROFILE if $HOME is undefined', function () {
    process.env.USERPROFILE = 'USERPROFILE';

    should(AwsCredentials.resolveHomePath()).eql('USERPROFILE');
  });

  it('uses $HOMEPATH if $HOME and $USERPROFILE are undefined', function () {
    process.env.HOMEPATH = 'HOMEPATH';

    should(AwsCredentials.resolveHomePath()).eql('C:/HOMEPATH');
  });

  it('uses $HOMEDRIVE with $HOMEPATH if defined', function () {
    process.env.HOMEPATH = 'HOMEPATH';
    process.env.HOMEDRIVE = 'D:/';

    should(AwsCredentials.resolveHomePath()).eql('D:/HOMEPATH');
  });
});
