const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/user.model');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'https://digitex-app.azurewebsites.net/api/auth/google/callback',
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ email: profile.emails[0].value });

            if (existingUser) return done(null, existingUser);

            const newUser = await User.create({
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                username: profile.emails[0].value.split("@")[0],
                provider: 'google',
                isVerified: true,
            });

            done(null, newUser);
        }
    )
);