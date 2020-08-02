// const mongoose = require("mongoose");

// const User = require('../models/user');
// const Token = require('../models/token')

// const bcrypt = require('bcryptjs');
// let uuid = require('uuid');




// const salt =  bcrypt.genSalt(10);

// module.exports = {};

// // module.exports.create = (userData) => {
// //     return User.create(userData);
// //   }

// // module.exports.getByEmail = (userData) => {
// //     return User.findOne({email: userData.email});
// // }


// module.exports.signUp = async (userData) => {

//     const  user = await User.findOne({ email : userData.email });
//       if (user) {
//           return false;
//       } else {
//                 // const hashedPassword = await bcrypt.hash(userData.password, salt);    
//                 // // new user
//                 // const user = new User({
//                 //     email: userData.email,
//                 //     password: hashedPassword,
//                 // })
//                 // const newUser = await User.create(user);
//                 // return newUser; 

                
//         userData.password = await bcrypt.hash(userData.password, salt);
//         user = await User.create(userData);
//         return user;
//       }

//  };

 

//  module.exports.login = async (userData) => {
//       const user = await User.findOne({ email : userData.email }).lean();

//       if (!user) { 
//           return false; 
//       }

//       else {
//         const validPass = await bcrypt.compare(userData.password, user.password);
//         if (!validPass ){
//                   return  res.status(400).send('Login Failed');
//          } else{
  
//             const newToken = await Token.create({ token: uuid.v4(), userId : user._id });
//             return newToken; 
//         }
//       }
      

//  }



// module.exports.logout = async (token) => {
  
//   // const foundToken = await Token.findOne({ token : token });
//   // if (!foundToken) {
//   //     return false;
//   // } else {
//     // remove token
//   try{
//     const DeletedToken = await Token.deleteOne({ token: token }); 
//       return true;}
//   catch(e){
//     throw e;
//   }
//   // };
// }

// module.exports.changePassword = async (userId, password) => {
  
//       try {
//         const newHashedPassword = await bcrypt.hash(password, salt);
//         const user = await User.updateOne({ _id : userId }, { 'password' : newHashedPassword});
//         return user ;
//       } catch (err) {
//           throw err;
//       }
    
      
// };



// // class BadDataError extends Error {};
// // module.exports.BadDataError = BadDataError;


const { Router } = require("express");
	const router = Router();
	const bcrypt = require("bcryptjs");
	const userDAO = require("../daos/user");
	const tokenDAO = require("../daos/token");
	

	// Check login creds when necessary
	const logInCheck = async (req,res,next) => {
	    const header = req.headers.authorization;
	        if (header) {
	            const tokenHeader = header.split(' ')[1];
	            req.token = tokenHeader;
	            if (req.token) {
	                const userId = await tokenDAO.tokenUser(req.token);
	                if (userId) {
	                    req.userId = userId;
	                    next();
	                } else {
	                    res.sendStatus(401);
	                }
	            } else {
	                res.sendStatus(401);
	            }
	        } else {
	            res.sendStatus(401);
	    } 
	};
	

	// Change password
	router.post("/password", logInCheck, async (req, res, next) => {
	    const user = await tokenDAO.tokenUser(req.token);
	    const {password} = req.body;
	    if (!req.token) {
	        res.status(401).send('You don\'t have a token.');
	    }
	    else if (!password) {
	        res.status(400).send('No password provided');      
	    }
	    else if (password === '') {
	        res.status(401).send('Empty password');      
	    }
	    else if (!user) {
	        res.status(404).send('Access denied');
	    }
	    else {
	        try {
	            const updatedUser = await userDAO.changePassword(user, password);
	            res.sendStatus(200)
	        } 
	        catch (error) {
	            res.status(500).send(error.message);    
	        }
	    }
	})
	

	// Delete token associated with user
	router.post("/logout", logInCheck, async (req, res, next) => {
	    const token = req.token;
	    const user = await userDAO.logOut(token)
	    res.sendStatus(user ? 200 : 400);
	    next()
	})
	

	//Create user
	router.post("/signup", async (req, res, next) => {
	    const body = req.body;
	    if (!body.password) {
	        res.status(400).send('No password provided');
	    }
	    else {
	        const salt = await bcrypt.genSalt(10);
	        const savedHash = await bcrypt.hash(body.password, salt);
	        const userCheck = await userDAO.userCheck(body.email, savedHash);
	        if (!userCheck) {
	            const user = await userDAO.createUser(body.email, savedHash);
	            res.sendStatus(user ? 200 : 400);
	        }
	        else {
	            res.sendStatus(409)
	        }
	    }    
	    
	    next()
	})
	

	// Login the user
	router.post("/", async (req, res, next) => {
	    const body = req.body;
	    if (!body.password) {
	        res.status(400).send('Please provide a password.');
	    }
	    else {
	        const userToken = await userDAO.loginUser(body.email, body.password);
	        if (userToken) {
	            res.status(200).json(userToken); 
	        }
	        else {
	            res.status(401).send('Login failed.');
	        }
	    }
	    next()
	})
	

	module.exports = router;





