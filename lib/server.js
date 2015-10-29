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

app.get('/', auth.guard, function (req, res) {
  var email = req.session.passport.user
  var saml = req.session.passport.saml
  res.end('Hello, '+req.user.firstName+'!')

  process.nextTick(function () {
    auth.users.select (email, function (err, user) {
      if (err) {
        return console.log(err)
      }
      if (!user) {
        return console.log('User not found: %s', email)
      }

      var sts = new Aws.STS()
      var xml = user.getAssertionXml()
      var doc = new xmldom.DOMParser().parseFromString(xml)
      var arns = xpath(doc, "//saml2:Attribute[@Name='https://aws.amazon.com/SAML/Attributes/Role']/saml2:AttributeValue/text()")[0].data.split(',')

      sts.assumeRoleWithSAML({
        PrincipalArn: arns[1],
        RoleArn: arns[0],
        SAMLAssertion: saml,
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

app.post('/login/callback', auth.authenticate('saml', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
  req.session.passport.saml = req.body.SAMLResponse
  res.redirect('/')
})

app.get('/login', auth.authenticate('saml', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
  res.redirect('/')
})

app.use(errorHandler())

module.exports = app
