const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/student');

passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(username, password, done) {
        Student.findOne({ userid: username}, function(err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'No user found.' });
            }
            if (!user.validPassword(password)) {
                return done(null, false, { message: 'Wrong password.' });
            }
            return done(null, user);
        });
    })
);