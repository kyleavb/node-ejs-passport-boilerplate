
require('dotenv').config();
var express = require('express');
var bodyParser = require('body-parser');
var ejsLayouts = require('express-ejs-layouts');
var db = require('./models');
var app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: false}));
app.use(ejsLayouts)

var PORT = process.env.PORT || 3000;

app.get("/", (req, res)=>{
    res.render('home');
});

app.get("/signup", (req, res)=>{
    res.render('signup');
});

app.post('/signup', (req, res)=>{
    console.log(req.body);
    res.sendStatus(200);
    db.user.findOrCreate({
        where:{
            email: req.body.email
        },
        defaults:{
            firstName: req.body.first_name,
            lastName: req.body.last_name,
            userName: req.body.user_name,
            email: req.body.email,
            dateofBirth: req.body.birth_date,
            password: req.body.password
        }
    }).spread((user, created)=>{
        if(created){
            console.log('created');
            res.redirect('/');
        }
    })
});

app.listen(PORT, ()=>{
    console.log(`Server running on Port: ${PORT}`);
})