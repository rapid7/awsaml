var express = require('express')
  , connect = require('connect')
  , passport = require('passport')
  , Aws = require('aws-sdk')
  , config = require('./config')
  , SamlStrategy = require('passport-saml').Strategy
  , users = []
  , app = express()

Aws.config.credentials = new Aws.SharedIniFileCredentials({
  profile: 'dev-aws-keys'
})

function findByEmail (email, done) {
  var i = 0
    , length = users.length
    , user = null
  for (i = 0; i < length; i += 1) {
    user = users[i]
    if (user.email === email) {
      return done(null, user)
    }
  }
  return done(null, null)
}

passport.serializeUser(function (user, done) {
  done(null, user.email)
})

passport.deserializeUser(function (id, done) {
  findByEmail(id, function (err, user) {
    done(err, user)
  })
})

passport.protected = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

passport.use(new SamlStrategy({
  path: '/login/callback',
  issuer: config.auth.issuer,
  entryPoint: config.auth.entryPoint,
  cert: config.auth.cert
}, function (profile, done) {
  if (!profile.email) {
    return done(new Error('No email found'), null)
  }
  process.nextTick(function () {
    findByEmail(profile.email, function (err, user) {
      if (err) {
        return done(err)
      }
      if (!user) {
        users.push(profile)
        return done(null, profile)
      }
      return done(null, user)
    })
  })
}))

app.configure(function () {
  app.use(express.logger())
  app.use(connect.compress())
  app.use(express.cookieParser())
  app.use(express.bodyParser())
  app.use(express.session({secret: 'very secret'}))
  app.use(passport.initialize())
  app.use(passport.session())
})

app.get('/', passport.protected, function (req, res) {
  var email = req.session.passport.user
  res.end('Hello '+email)
  process.nextTick(function () {
    findByEmail (email, function (err, user) {
      var assertion = null
        , sts = new Aws.STS()
      if (err) {
        return console.log(err)
      }
      if (!user) {
        return console.log('User not found: %s', email)
      }
      assertion = user.getResponseBase64()
      var xml = new Buffer(assertion, 'base64').toString('utf8')

      sts.assumeRole({
        ExternalId: user.externalId,
        RoleArn: config.aws.roleArn,
        RoleSessionName: email,
        DurationSeconds: 3600
      }, function (err, data) {
        if (err) {
          return console.log(err, err.stack)
        }
        return console.log(data)
      })
    })
  })
})

app.get('/health', passport.protected, function (req, res) {
  res.end('health check')
})

app.post('/login/callback', passport.authenticate('saml', {
  failureRedirect: '/',
  failureFlush: true
}), function (req, res) {
  res.redirect('/')
})

app.get('/login', passport.authenticate('saml', {
  failureRedirect: '/',
  failureFlush: true
}), function (req, res) {
  res.redirect('/')
})

app.listen(2600)
console.log('Server started.')
