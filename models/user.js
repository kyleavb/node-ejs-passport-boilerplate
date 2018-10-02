'use strict';
var bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const user = sequelize.define('user', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    userName: DataTypes.STRING,
    email: DataTypes.STRING,
    dateOfBirth: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks:{
      beforeCreate: (pendingUser)=>{
        if(pendingUser && pendingUser.password){
          var hash = bcrypt.hashSync(pendingUser.password, 10);
          console.log(hash);
          pendingUser.password = hash;
        }
      }
    }
  });
  user.associate = function(models) {
    // associations can be defined here
  };

  user.prototype.verifyPassword = function(enteredPass){
    return bcrypt.compareSync(enteredPass, this.password)
  };

  user.prototype.toJSON = function(){
    var userData = this.get();
    delete userData.password;
    return userData;
  }

  return user;
};