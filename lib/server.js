var express = require('express')
var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var errorHandler = require('errorhandler')

var Aws = require('aws-sdk')
var xmldom = require('xmldom')
var xpath = require('xpath.js')
var config = require('../config')
var Auth = require('../lib/auth')
var AwsCredentials = require('../lib/aws-credentials')

var auth = new Auth(config.auth)
var credentials = new AwsCredentials(config.aws)
var app = express()

var sessionSecret = '491F9BAD-DFFF-46E2-A0F9-56397B538060'
app.set('port', 2600)
app.use(morgan('dev'))
app.use(cookieParser(sessionSecret))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: sessionSecret }))
app.use(auth.initialize())
app.use(auth.session())

app.post(config.auth.path, auth.authenticate('saml', {
  failureRedirect: config.auth.entryPoint,
  failureFlash: true
}), function (req, res) {
  req.session.passport.saml = req.body.SAMLResponse
  req.session.passport.arns = req.user['https://aws.amazon.com/SAML/Attributes/Role'].split(',')
  res.redirect('/v1')
})

app.all('*', auth.guard)

app.all('/v1', function (req, res) {
  res.end('Hello, '+req.user.firstName+'!')

  process.nextTick(function () {
    auth.users.select (req.session.passport.user, function (err, user) {
      if (err) {
        return console.log(err)
      }
      if (!user) {
        return console.log('User not found: %s', req.session.passport.user)
      }

      var sts = new Aws.STS()
      sts.assumeRoleWithSAML({
        PrincipalArn: req.session.passport.arns[1],
        RoleArn: req.session.passport.arns[0],
        SAMLAssertion: req.session.passport.saml,
        DurationSeconds: config.aws.duration
      }, function (err, data) {
        if (err) {
          return console.log(err, err.stack)
        }
        credentials.save(data.Credentials, function (err) {
          if (err) {
            return console.log(err, err.stack)
          }
        })
      })
    })
  })
})

app.use(errorHandler())

module.exports = app
