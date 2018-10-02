var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var db = require('../models');

passport.serializeUser(function(user, cb){
    cb(null, user.id);
  });
  
  passport.deserializeUser(function(id, cb){
    db.user.findById(id).then(function(user){
        user = user.toJSON();
        cb(null, user);
    }).catch(cb);
  });
  
  passport.use(new LocalStrategy({
    usernameField: 'userName',
    passwordField: 'password'
  }, (userId, password, cb)=>{
      console.log(`Passport - user: ${userId}, pass: ${password}`)
      db.user.findOne({
          where: {userName: userId}
        }).then(function(user){
            if(!user || !user.verifyPassword(password)){
                cb(null, false, {message: 'Incorrect user name or password.'});
            }else{
                user = user.toJSON();
                cb(null, user);
            }
        }
    ).catch(cb);
    }));
  
  module.exports = passport;