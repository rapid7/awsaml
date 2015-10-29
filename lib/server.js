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
app.set('host', config.server.host)
app.set('port', config.server.port)
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
  var arns = req.user['https://aws.amazon.com/SAML/Attributes/Role'].split(',')
  req.session.passport.samlResponse = req.body.SAMLResponse
  req.session.passport.roleArn = arns[0]
  req.session.passport.principalArn = arns[1]
  res.redirect('/refresh')
})

app.all('*', auth.guard)

app.all('/refresh', function (req, res, next) {
  var session = req.session.passport
  var sts = new Aws.STS()
  sts.assumeRoleWithSAML({
    PrincipalArn: session.principalArn,
    RoleArn: session.roleArn,
    SAMLAssertion: session.samlResponse,
    DurationSeconds: config.aws.duration
  }, function (err, data) {
    if (!err && data) {
      credentials.save(data.Credentials, function (err) {
        if (!err) {
          app.locals.accessKey = data.Credentials.AccessKeyId
          app.locals.secretKey = data.Credentials.SecretAccessKey
          next()
        }
      })
    }
  })
}, function (req, res) {
html = '<!DOCTYPE html>'+
'<html lang="en">'+
'<head>'+
'<title>Dev AWS Keys</title>'+
'<meta name="viewport" content="width=device-width, initial-scale=1" />'+
'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css" integrity="sha512-dTfge/zgoMYpP7QbHy4gWMEGsbsdZeCXz7irItjcC3sPUFtf0kuFbDz/ixG7ArTxmDjLXDmezHubeNikyKGVyQ==" crossorigin="anonymous" />'+
'<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css" integrity="sha384-aUGj/X2zp5rLCbBxumKTCw2Z50WgIr1vs/PFN4praOTvYXWlVyh2UtNUU0KAUhAX" crossorigin="anonymous" />'+
'</head>'+
'<style>'+
'body {'+
'  padding: 10px;'+
'}'+
'.col-centered {'+
'  float: none;'+
'  margin: 0 auto;'+
'}'+
'.widget {'+
'  padding: 10px;'+
'  border-radius: 5px;'+
'  border: 1px solid #ccc;'+
'}'+
'</style>'+
'<body>'+
'<div class="container-fluid">'+
'<div class="row">'+
'<div class="col-xs-9 col-centered widget">'+
'<p>Access Key: <span id="accessKey">'+app.locals.accessKey+'</span></p>'+
'<p>Secret Key: <span id="secretKey">'+app.locals.secretKey+'</span></p>'+
'<a class="btn btn-default" href="/refresh" role="button">Refresh</a>'+
'</div>'+
'</div>'+
'</div>'+
'</body>'+
'</html>'
  res.end(html)
})

app.use(errorHandler())

module.exports = app
