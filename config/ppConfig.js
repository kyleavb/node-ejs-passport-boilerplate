var passport = require('passport');
var strat = require('passport-local').Strategy;
var db = require('./models');

passport.use(new strat(
    (username, password, cb)=>{
        db.user.findByU
    }
))