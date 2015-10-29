var express = require('express')
var Aws = require('aws-sdk')
var xmldom = require('xmldom')
var xpath = require('xpath.js')
var config = require('./config')
var Auth = require('./lib/auth')
var AwsCredentials = require('./lib/aws-credentials')

var auth = new Auth(config.auth)
var credentials = new AwsCredentials(config.aws)
var app = express()

app.configure(function () {
  app.use(express.logger())
  app.use(express.cookieParser())
  app.use(express.bodyParser())
  app.use(express.session({secret: 'very secret'}))
  app.use(auth.initialize())
  app.use(auth.session())
})

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

app.listen(2600)

var Application = require('app')
var BrowserWindow = require('browser-window')
var Storage = require('./lib/storage')

var mainWindow = null

Application.commandLine.appendSwitch('disable-http-cache')

Application.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

Application.on('ready', function() {
  var lastWindowState = Storage.get('lastWindowState')
  if (lastWindowState === null) {
    lastWindowState = {
      width: 800,
      height: 700
    }
  }

  mainWindow = new BrowserWindow({
    title: 'Dev AWS Keys',
    x: lastWindowState.x,
    y: lastWindowState.y,
    width: lastWindowState.width,
    height: lastWindowState.height,
    show: false,
    'web-preferences': {
      'node-integration': false
    }
  })

  mainWindow.on('close', function () {
    var bounds = mainWindow.getBounds()
    Storage.set('lastWindowState', {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      version: 1
    })
  })

  mainWindow.on('closed', function() {
    mainWindow = null
  })

  mainWindow.loadUrl(config.auth.entryPoint)
  mainWindow.show()

  setInterval(function () {
    console.log('Reloading...')
    mainWindow.loadUrl('http://localhost:2600/login')
  }, (config.aws.duration - 10) * 1000)
})
