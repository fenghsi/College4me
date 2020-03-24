const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Student = require('../models/student');
const Application = require('../models/applications');

passport.serializeUser(async function(user, done) {
    // console.log('serializing user: ');
    // console.log(user);
    // console.log(user._id);
    
    done(null, user);
  });
  
  passport.deserializeUser( async function(user, done) {
    // let user = await Student.findById(user.userid).lean();
    // console.log("Deser");
    // console.log(id);
    // console.log(user);
    done(null, user);
  });
passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
    function(userid, password, done) {
        Student.findOne({ userid: userid}, function(err, user) {
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