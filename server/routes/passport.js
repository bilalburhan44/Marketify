const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/userModel");
require('dotenv').config();

// Passport configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "https://marketify-qcnh.onrender.com/auth/google/callback"
},
function(accessToken, refreshToken, profile, done) {
  const { id, emails, displayName, photos } = profile;
  const email = emails && emails.length > 0 ? emails[0].value : undefined;
  const profilepic = photos && photos.length > 0 ? photos[0].value : undefined; // Extract profile picture
  User.findOrCreate({ googleId: id, email, name: displayName, profilepic:profilepic })
    .then(user => done(null, user))
    .catch(err => done(err));
}
));

passport.serializeUser((user, done) => {
  if (user) {
    done(null, user.id); // Ensure user is not undefined
  } else {
    done(new Error('User is undefined'));
  }
});
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err));
});

module.exports = passport;
