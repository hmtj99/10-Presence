const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('./keys');
const User = require('../models/user.model');

passport.serializeUser((user,done) => {
    done(null, user.id);
})

passport.deserializeUser((id,done) => {
    User.findById(id).then(user => {
        done(null,user);
    });
})


passport.use(
    new GoogleStrategy({
        callbackURL: 'http://localhost:3000/auth/google/redirect',
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
    }, async (accessToken, refreshToken,profile,done) => {
        try{
            const registeredUser = await User.findOne({googleId:profile.id})
            if(registeredUser){
                // if user is already registered
                console.log("User already exists",registeredUser);
                done(null, registeredUser);
            }
            else{
                // if new user has signed in through google
                const newUser = await User.create({
                    email: profile._json.email,
                    googleId: profile.id,
                    name: profile._json.name,
                    coursesTeaching: [],
                    coursesEnrolledIn: [],
                    courseLectureMap: {},
                });
                done(null,newUser);
            }
        }
        catch(error){
            console.log(error);
        }
    })
)