const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user exists
        let user = await User.findOne({ email: profile.emails[0].value });

        // 2. If not, create user
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            role: "buyer", // default
          });
        }

        // 3. Send user to next step
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
