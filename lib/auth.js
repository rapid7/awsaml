var SamlStrategy = require('passport-saml').Strategy

function Users () {
  this.users = Object.create(null)
}

Users.prototype.upsert = function (user, done) {
  this.users[user.email] = user
  return done(null, user.email)
}

Users.prototype.select = function (email, done) {
  return done(null, this.users[email])
}

function Auth (options) {
  var self = this
  this.users = new Users()
  this.passport = require('passport')

  this.passport.serializeUser(function (user, done) {
    self.users.upsert(user, done)
  })

  this.passport.deserializeUser(function (id, done) {
    self.users.select(id, done)
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
