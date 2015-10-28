var express = require('express')
  , Aws = require('aws-sdk')
  , path = require('path')
  , fs = require('fs')
  , ini = require('ini')
  , xmldom = require('xmldom')
  , xpath = require('xpath.js')
  , config = require('./config')
  , Auth = require('./lib/auth')
  , cachedSAMLAssertion = null
  , app = express()

var auth = new Auth(config.auth)

function resolveHomePath () {
  var env = process.env
    , home = env.HOME ||
      env.USERPROFILE ||
      (env.HOMEPATH ? ((env.HOMEDRIVE || 'C:/') + env.HOMEPATH) : null)
  return home
}

function saveCredentials (credentials, done) {
  if (!credentials) {
    return done(new Error('Invalid AWS credentials'))
  }

  var home = resolveHomePath()
  if (!home) {
    return done(new Error('Cannot save credentials, HOME path not set'))
  }

  var awsConfigFile = path.join(home, '.aws', 'credentials')
  fs.readFile(awsConfigFile, 'utf8', function (err, data) {
    if (err) {
      return done(err)
    }

    var awsConfig = ini.parse(data)
    awsConfig[config.aws.profile] = {}
    awsConfig[config.aws.profile].aws_access_key_id = credentials.AccessKeyId
    awsConfig[config.aws.profile].aws_secret_access_key = credentials.SecretAccessKey
    awsConfig = ini.encode(awsConfig, { whitespace: true })

    fs.writeFile(awsConfigFile, awsConfig, 'utf8', function (err) {
      if (err) {
        return done(err)
      }
      return done(null)
    })
  })
}


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
  res.end('Hello '+email)
  process.nextTick(function () {
    auth.users.findByEmail (email, function (err, user) {
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
        SAMLAssertion: cachedSAMLAssertion,
        DurationSeconds: 3600
      }, function (err, data) {
        if (err) {
          return console.log(err, err.stack)
        }
        saveCredentials(data.Credentials, function (err) {
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
  cachedSAMLAssertion = req.body.SAMLResponse
  res.redirect('/')
})

app.get('/login', auth.authenticate('saml', {
  failureRedirect: '/',
  failureFlash: true
}), function (req, res) {
  res.redirect('/')
})

app.listen(2600)

var app = require('app')
var BrowserWindow = require('browser-window')
var Storage = require('./lib/storage')

var mainWindow = null

app.on('window-all-closed', function() {
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {
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
    show: false
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
})
