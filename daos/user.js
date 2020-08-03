const mongoose = require('mongoose');
const User = require('../models/user');
const Token = require('../models/token')

const bcrypt = require('bcryptjs');

const salt = 10;
const uuid = require('uuid-random');


module.exports = {};


module.exports.signUp = async (userData) => {
  // checking if user exists
  const user = await User.findOne({ email : userData.email });
      if (user) {
          return false;
      } else {
                const hashedPassword = await bcrypt.hash(userData.password, salt);    
                // new user
                const user = new User({
                    email: userData.email,
                    password: hashedPassword,
                })
                const newUser = await User.create(user);
                return newUser; 

      }


 };


 module.exports.login = async (userData) => {
    const user = await User.findOne({ email : userData.email }).lean();

    if (!user) { 
          return false; 
      };


    const validPass = await bcrypt.compare(userData.password, user.password);
    if (!validPass){
                return  false;
      } else{
        const newToken = await Token.create({ token: uuid(), userId : user._id });
        return newToken; 
      }

 }



module.exports.logout = async (auth) => {
    const token = await auth.split(' ')[1];
    const foundToken = await Token.findOne({ token : token });
    if (!foundToken) {
        return false;
    } else {
      // remove token
        await Token.deleteOne({ token: token }); 
        return true;
    };
  }

module.exports.changePassword = async (auth, password) => {
    const token = await auth.split(' ')[1];
    const foundToken = await Token.findOne({ token : token });
    if (!foundToken) {
        return false;
    } else {
        try {
          
          const hashedPassword = await bcrypt.hash(password, salt);
          await User.updateOne({ _id : foundToken.userId }, { $set: { 'password' : hashedPassword}});
          return true;
        } catch (err) {
            throw err;
        }
      }
      
};

