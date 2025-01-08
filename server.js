require('dotenv').config();
const cron = require('node-cron');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = 3000;
const User = require('./private/models/userModel');
const endpoints = require('./private/endpoints');
const {  isLoggedIn, } = require('./private/serverFunctions');

/// Gauth params
const session = require('express-session');
const path = require('path');
const passport = require('./auth');
const { profile, error } = require('console');

/// Nodemailer
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: 'corefitsegreteria@gmail.com',
    pass: 'ajfb vucd ncgs pbgk',
  },
});
transporter.verify().then(console.log).catch(console.error);
const sender = process.env.EMAIL_SENDER;

/// App SET
app.set('view engine', 'ejs');              // Set EJS as the view engine
app.set('trust proxy', 1);

app.use(session({
    secret: 'mysecret',
    reserve: false,
    saveUninitialized: true,
    //cookie: { secure: true }  // True for https, False for http (e.g. localhost:3000)
}));

app.use(passport.initialize());
app.use(passport.session());

/// App USE
app.use(endpoints);             // Use the endpoints in ./private/endpoints
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('public'))
//app.use(express.static(path.join(__dirname, 'client'))); // Forse da togliere

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');                                                                 // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');                                  // Allow these HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');    // Allow these headers
   
    res.header("Cache-Control", "no-cache, no-store, must-revalidate");                                             // HTTP 1.1.
    res.header("Pragma", "no-cache");                                                                               // HTTP 1.0.
    res.header("Expires", "0");                                                                                     // Proxies.

    next();
});

// Google Access
app.get('/', function(req, res) {
    res.render('pages/auth'); // Assuming you have a file auth.ejs in views/pages folder
});

app.get('/auth/google', passport.authenticate('google', { scope: ['email', 'profile'] }));

/// Redirect based on the status of auth
app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/auth/google/success',
        failureRedirect: '/auth/google/failure',
    })
);

app.get('/auth/google/success', isLoggedIn, async (req, res) => {
    try{
        const userEmail = req.user.email;
        
        const existingUser = await User.findOne({ email: userEmail });
        console.log(existingUser);

        if (!existingUser) {
            console.log(`Utente non registrato. | Email: [${req.user.email}]`);
            return res.redirect('/html/registration.html');
        }
        res.redirect('/html/index.html');                               // On success redirect to index.html
    }catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error during Login');
    }
});

app.get('/auth/google/failure', (req, res) => { res.send("Fail on Login!"); });

app.use('/auth/logout', (req, res) => { 
    console.log(req.user.email + " logged out");
    req.session.destroy();
    res.redirect('../index.html'); 
});

/// --- Connect to MongoDB
let date_ob = new Date().toString().split("(", 1)[0]
var connsectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@e-commerce.rp4la.mongodb.net/?retryWrites=true&w=majority&appName=e-commerce`;
mongoose.connect(connsectionString)
.then(() => {
    app.listen(port, () => {
        console.log(date_ob + ` | E-Commerce app listening on port ${port}`);
    });
}).catch((error)=> {
    console.log(error)
})