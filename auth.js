require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    passReqToCallback: true
}, function(request, accessToken, refreshToken, profile, done) {
    // Here you handle the user object provided by Google
    // For example, you can save the user to your database or create a new user
    // In this example, let's assume the user is already available in the profile object

    // Retrieve user details from the profile object
    const user = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        dob: profile.birthday,
        profileImage: profile.photos[0].value
        // Add any other relevant user data
    };

    // Pass the user object to the done callback
    done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user); // Serialize the entire user object
});

passport.deserializeUser((user, done) => {
    // Here you might query your database to find the user by ID
    // For simplicity, we'll just return the user object as is
    done(null, user);
});

module.exports = passport;