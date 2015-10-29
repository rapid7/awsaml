var SamlStrategy = require('passport-saml').Strategy

function Users () {
  this.users = Object.create(null)
}

Users.prototype.upsert = function (user) {
  this.users[user.email] = user
}

Users.prototype.select = function (email, done) {
  return done(null, this.users[email])
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
    self.users.select(id, function (err, user) {
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
      self.users.select(profile.email, function (err, user) {
        if (err) {
          return done(err)
        }

        if (!user) {
          self.users.upsert(profile)
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
