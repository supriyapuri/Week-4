
const User = require('../models/user');
const Token = require('../models/token')

const bcrypt = require('bcryptjs');
let uuid = require('uuid-random');




const salt =  bcrypt.genSalt(10);

module.exports = {};

// module.exports.create = (userData) => {
//     return User.create(userData);
//   }

// module.exports.getByEmail = (userData) => {
//     return User.findOne({email: userData.email});
// }


module.exports.signUp = async (userData) => {

  const  user = await User.findOne({ email : userData.email });
      if (user) {
          return false;
      } else {
                // const hashedPassword = await bcrypt.hash(userData.password, salt);    
                // // new user
                // const user = new User({
                //     email: userData.email,
                //     password: hashedPassword,
                // })
                // const newUser = await User.create(user);
                // return newUser; 

                
        userData.password = await bcrypt.hash(userData.password, salt);
        user = await User.create(userData);
        return user;
      }


 };


 module.exports.login = async (userData) => {
      const user = await User.findOne({ email : userData.email }).lean();

      if (!user) { 
          return false; 
      };


      const validPass = await bcrypt.compare(userData.password, user.password);
      if (!validPass ){
                return  res.status(400).send('Login Failed');
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



// class BadDataError extends Error {};
// module.exports.BadDataError = BadDataError;



