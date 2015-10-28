var ini = require('ini')
var fs = require('fs')
var path = require('path')

function AwsCredentials (options) {
  this.profile = options.profile
}

AwsCredentials.prototype.save = function (credentials, done) {
  this.saveAsIniFile(credentials, function (result) {
    done(result)
  })
}

AwsCredentials.prototype.saveAsIniFile = function (credentials, done) {
  if (!credentials) {
    return done(new Error('Invalid AWS credentials'))
  }

  if (!this.profile) {
    return done(new Error('Cannot save AWS credentials, profile not set'))
  }

  var home = this.resolveHomePath()
  if (!home) {
    return done(new Error('Cannot save AWS credentials, HOME path not set'))
  }

  var self = this
  var configFile = path.join(home, '.aws', 'credentials')
  fs.readFile(configFile, 'utf8', function (err, data) {
    if (err) {
      return done(err)
    }

    var config = ini.parse(data)
    config[self.profile] = {}
    config[self.profile].aws_access_key_id = credentials.AccessKeyId
    config[self.profile].aws_secret_access_key = credentials.SecretAccessKey
    config = ini.encode(config, { whitespace: true })

    fs.writeFile(configFile, config, 'utf8', function (err) {
      if (err) {
        return done(err)
      }
      return done(null)
    })
  })
}

AwsCredentials.prototype.resolveHomePath = function () {
  var env = process.env
    , home = env.HOME ||
      env.USERPROFILE ||
      (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null)
  return home
}

module.exports = AwsCredentials
