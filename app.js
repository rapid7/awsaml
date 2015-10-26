var express = require('express')
  , connect = require('connect')
  , passport = require('passport')
  , SamlStrategy = require('passport-saml').Strategy
  , users = []
  , app = express()


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
  issuer: 'http://localhost:2600/',
  path: '/login/callback',
  entryPoint: 'http://localhost:2600/login/callback',
  cert: ''
}, function (profile, done) {
  console.log("Profile: %s", JSON.stringify(profile))
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
  res.end('Hello '+req.session.passport.user)
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
