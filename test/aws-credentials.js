'use strict';

const AwsCredentials = require('../lib/aws-credentials');
const should = require('should');

describe('AwsCredentials#saveAsIniFile', function () {
  it('returns an error when credentials are null', function (done) {
    const aws = new AwsCredentials();

    aws.saveAsIniFile(null, 'profile', (error, data) => {
      should(data).be.undefined();
      error.toString().should.not.eql('');
      done();
    });
  });

  it('returns an error when profile is null', function (done) {
    const aws = new AwsCredentials();

    aws.saveAsIniFile({}, null, (error, data) => {
      should(data).be.undefined();
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

    aws.saveAsIniFile({}, 'profile', (error, data) => {
      should(data).be.undefined();
      error.toString().should.not.eql('');
      done();
    });
  });

  it('returns an error when $HOME path is empty', function (done) {
    const aws = new AwsCredentials();

    process.env.HOME = '';

    aws.saveAsIniFile({}, 'profile', (error, data) => {
      should(data).be.undefined();
      error.toString().should.not.eql('');
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
