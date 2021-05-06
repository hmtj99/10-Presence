const express = require('express');
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const courseRoutes = require('./routes/course-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');

const app = express();
app.set("view engine", "ejs");

app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
}))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/course', courseRoutes);

app.get('/', (req, res) => {
    res.render('home');
})


app.listen(3000, () => {
    console.log("Server has started!!!");
    mongoose.connect(keys.mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true

        },
        (err) => {
            if (err) {
                console.log("Error connection to database");
            }
            else {
                console.log("Connected to MongoDB database");
            }
        });
})