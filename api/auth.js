const SamlStrategy = require('passport-saml').Strategy;

class Auth {
  constructor(options) {
    this.users = Object.create(null);
    this.passport = require('passport');

    this.passport.serializeUser((user, done) => {
      this.users[user.nameID] = user;

      return done(null, user.nameID);
    });

    this.passport.deserializeUser((id, done) => done(null, this.users[id]));

    this.guard = function guard(req, res, next) {
      if (req.isAuthenticated()) {
        return next();
      }
      return res.json({
        redirect: options.entryPoint,
      });
    };
  }

  initialize() {
    return this.passport.initialize();
  }

  session() {
    return this.passport.session();
  }

  authenticate(type, options) {
    return this.passport.authenticate(type, options);
  }

  configure(options) {
    const samlCallback = (profile, done) => done(null, profile);

    this.passport.use(new SamlStrategy(options, samlCallback));
  }
}

module.exports = Auth;
