const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

module.exports = (passport) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/users/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const user = await User.findOne({ email: profile.emails[0].value });
          if (user) {
            return done(null, user);
          }

          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            password: null, // No password for Google users
            role: "patient", // Default role
            isGoogleUser: true, // Mark as Google user
          });

          const savedUser = await newUser.save();
          done(null, savedUser);
        } catch (err) {
          done(err, false);
        }
      }
    )
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser((id, done) =>
    User.findById(id).then((user) => done(null, user))
  );
};
