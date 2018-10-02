
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var passport = require('./config/ppConfig');
var session = require('express-session');
var db = require('./models');
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: false}));
app.use(ejsLayouts)
app.use(passport.initialize());
app.use(session({ 
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use((req, res, next)=>{
    if(!res.locals.currentUser){
        console.log(req.user);
        res.locals.currentUser = req.user;
    }
    console.log(!res.locals.currentUser)
    console.log(res.locals.currentUser)
    next();
})

var PORT = process.env.PORT || 3000;


app.get("/", (req, res)=>{    
    res.render('home');
});

app.get("/signup", (req, res)=>{
    res.render('signup');
});

app.post('/signup', (req, res)=>{
    console.log(req.body);
    db.user.findOrCreate({
        where:{
            email: req.body.email
        },
        defaults:{
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            userName: req.body.userName,
            email: req.body.email,
            dateOfBirth: req.body.birth_date,
            password: req.body.password
        }
    }).spread((user, created)=>{
        if(created){
            passport.authenticate("local",{
                successRedirect: '/',
                successFlash:'You did it!'
            })
            res.redirect('/');
        }else{
            console.log('user found', user.firstName);
            res.redirect('/login')
        }
    })
});

app.get('/login', (req, res)=>{
    res.render('login')
});

app.post('/login', passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login'
    })
);

app.get('/logout', (req, res)=>{
    req.logOut();
    res.redirect('/');
});

app.get('/profile', (req, res) => {
    res.render('profile');
})

app.listen(PORT, ()=>{
    console.log(`Server running on Port: ${PORT}`);
})