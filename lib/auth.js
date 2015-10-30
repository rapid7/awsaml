var SamlStrategy = require('passport-saml').Strategy

function Auth (options) {
  var self = this
  this.users = Object.create(null)
  this.passport = require('passport')

  this.passport.serializeUser(function (user, done) {
    self.users[user.nameID] = user
    return done(null, user.nameID)
  })

  this.passport.deserializeUser(function (id, done) {
    return done(null, self.users[id])
  })

  this.passport.use(new SamlStrategy(options, function (profile, done) {
    return done(null, profile)
  }))

  this.guard = function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect(options.entryPoint)
  }
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

module.exports = Auth
