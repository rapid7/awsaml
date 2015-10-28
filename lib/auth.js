var SamlStrategy = require('passport-saml').Strategy

function Users () {
  this.users = []
}

Users.prototype.add = function (user) {
  this.users.push(user)
}

Users.prototype.findByEmail = function (email, done) {
  var i = 0
  var length = this.users.length
  var user = null

  for (i = 0; i < length; i += 1) {
    user  = this.users[i]
    if (user.email === email) {
      return done(null, user)
    }
  }

  return done(null, null)
}

function Auth (options) {
  var self = this
  this.users = new Users()

  this.loginPath = options.loginPath || '/login'
  this.loginCallbackPath = options.loginCallbackPath || '/login/callback'
  this.issuer = options.issuer
  this.entryPoint = options.entryPoint
  this.cert = options.cert

  this.passport = require('passport')

  this.passport.serializeUser(function (user, done) {
    done(null, user.email)
  })

  this.passport.deserializeUser(function (id, done) {
    self.users.findByEmail(id, function (err, user) {
      done(err, user)
    })
  })

  this.passport.use(new SamlStrategy({
    path: this.loginCallbackPath,
    issuer: this.issuer,
    entryPoint: this.entryPoint,
    cert: this.cert
  }, function (profile, done) {
    if (!profile.email) {
      return done(new Error('Failed to find profile'), null)
    }

    process.nextTick(function () {
      self.users.findByEmail(profile.email, function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          self.users.add(profile)
          return done(null, profile)
        }

        return done(null, user)
      })
    })
  }))
}

Auth.prototype.initialize = function () {
  return this.passport.initialize()
}

Auth.prototype.session = function () {
  return this.passport.session()
}

Auth.prototype.authenticate = function (type, options) {
  return this.passport.authenticate(type, options)
}

Auth.prototype.guard = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect(this.loginPath)
}

module.exports = Auth
