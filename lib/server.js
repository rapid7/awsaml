var path = require('path')
var https = require('https')

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
var Storage = require('../lib/storage')

var auth = new Auth(config.auth)
var credentials = new AwsCredentials(config.aws)
var app = express()

var sessionSecret = '491F9BAD-DFFF-46E2-A0F9-56397B538060'
app.set('host', config.server.host)
app.set('port', config.server.port)
app.set('configureUrl', 'http://'+config.server.host+':'+config.server.port+'/configure')
app.set('views', path.join(__dirname, '..', 'views'))
app.set('view engine', 'jsx')
app.engine('jsx', require('express-react-views').createEngine())
app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(morgan('dev'))
app.use(cookieParser(sessionSecret))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: sessionSecret }))
app.use(auth.initialize())
app.use(auth.session())

app.post(config.auth.path, auth.authenticate('saml', {
  failureRedirect: app.get('configureUrl'),
  failureFlash: true
}), function (req, res) {
  var arns = req.user['https://aws.amazon.com/SAML/Attributes/Role'].split(',')
  req.session.passport.samlResponse = req.body.SAMLResponse
  req.session.passport.roleArn = arns[0]
  req.session.passport.principalArn = arns[1]
  req.session.passport.accountId = arns[0].split(':')[4]
  res.redirect('/refresh')
})

app.get('/configure', function (req, res) {
  var metadataUrl = Storage.get('metadataUrl')
  if (!metadataUrl) {
    metadataUrl = ''
  }

  res.render('configure', {
    title: 'Rapid7 - Awsaml',
    metadataUrl: metadataUrl
  })
})

app.post('/configure', function (req, res) {
  var metadataUrl = req.body.metadataUrl
  Storage.set('metadataUrl', metadataUrl)

  var xmlReq = https.get(metadataUrl, function (xmlRes) {
    var xml = ''

    xmlRes.on('data', function (chunk) {
      xml += chunk
    })

    xmlRes.on('end', function () {
      var doc = new xmldom.DOMParser().parseFromString(xml)
      var safe_xpath = function (doc, path) {
        try {
          return xpath(doc, path)
        } catch (_) {
          return null
        }
      }

      var cert = safe_xpath(doc, "//*[local-name(.)='X509Certificate']/text()")
      if (cert) {
        cert = cert.length ? cert[0].data.replace(/\s+/g, '') : null
      }
      config.auth.cert = cert

      var issuer = safe_xpath(doc, "//*[local-name(.)='EntityDescriptor']/@entityID")
      if (issuer) {
        issuer = issuer.length ? issuer[0].value : null
      }
      config.auth.issuer = issuer

      var entryPoint = safe_xpath(doc, "//*[local-name(.)='SingleSignOnService' and @Binding='urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST']/@Location")
      if (entryPoint) {
        entryPoint = entryPoint.length ? entryPoint[0].value : null
      }
      config.auth.entryPoint = entryPoint

      if (cert && issuer && entryPoint) {
        app.set('entryPointUrl', config.auth.entryPoint)
        auth.configure(config.auth)
        res.redirect(config.auth.entryPoint)
      }
      else {
        res.render('configure', {
          title: 'Rapid7 - Awsaml',
          metadataUrl: metadataUrl,
          error: 'The SAML metadata is invalid.'
        })
      }
    })
  })

  xmlReq.on('error', function (err) {
    res.render('configure', {
      title: 'Rapid7 - Awsaml',
      metadataUrl: metadataUrl,
      error: err
    })
  })
})

app.all('*', auth.guard)

app.all('/refresh', function (req, res) {
  var session = req.session.passport
  var sts = new Aws.STS()
  sts.assumeRoleWithSAML({
    PrincipalArn: session.principalArn,
    RoleArn: session.roleArn,
    SAMLAssertion: session.samlResponse,
    DurationSeconds: config.aws.duration
  }, function (err, data) {
    if (!err && data) {
      res.render('refresh', {
        title: 'Rapid7 - Awsaml',
        accessKey: data.Credentials.AccessKeyId,
        secretKey: data.Credentials.SecretAccessKey,
        sessionToken: data.Credentials.SessionToken
      })
      credentials.save(data.Credentials, 'awsaml-'+session.accountId, function (err) {
        if (err) {
          rs.render('refresh', {
            error: err
          })
        }
      })
    }
  })
})

app.use(errorHandler())

module.exports = app
