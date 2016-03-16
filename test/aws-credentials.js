'use strict';

const AwsCredentials = require('../lib/aws-credentials');
const should = require('should');

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
