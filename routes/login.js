
// const { Router } = require("express");
// const router = Router();
// const bcrypt = require("bcrypt");
// const userDAO = require("../daos/user");
// const tokenDAO = require("../daos/token");



//logout

// router.post("/logout", async (req, res, next) => {
//     if (!req.headers.authorization) {
//         return res.status(401).send('Missing token');
//     }
//     try {
//         const logout = await userDAO.logout(req.headers.authorization);
//         if (logout) {
//             res.status(200).send('logout successful')
//         } else {
//             res.status(401).send('Invalid Token')
//         }
//     } catch(e) {
//         // if (e instanceof userDAO.BadDataError) {
//         //   res.status(400).send(e.message);
//         // } else {
//           res.status(500).send(e.message);
//         }
//     //   }
// });

// // password change

// router.post('/password', async (req, res) =>{
//     if (!req.headers.authorization) {
//         return res.status(401).send('Missing token');
    
//     } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
//         res.status(400).send('Password required');
//     } else {
//         try {
//             const token = req.headers.authorization;
//             const password = req.body.password;
//             const success = await userDAO.changePassword(token, password);
//             if (success) {
//                 res.status(200).send('Password changed');
//             }

//         } catch(e) {
//             // if (e instanceof userDAO.BadDataError) {
//             //   res.status(400).send(e.message);
//             // } else {
//               res.status(500).send(e.message);
//             }
//         //   }
//     }


// });

// // middleware

// router.use(async (req, res, next) => {
//     if (!req.body.email || JSON.stringify(req.body.email) === '{}') {
//         res.status(400).send('Email Required');
//     } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
//         res.status(400).send('Password Required');
//     } else {
//         next();
//     }
// });


// // signup

// router.post("/signup", async (req, res) => {
//     try {
        
//         // checking if the user exists
//         // const emailExist = await User.findOne({email: req.body.email});
//         // if (emailExist){
//         //     res.status(409).send('Email already exists');
//         // }

        
//         const user = await userDAO.signUp(req.body);
//         if (user) {
//             res.status(200).send('Account Created');
//         } else {
//             res.status(409).send('User already exists');
//         }
           
//     } catch(e) {
//         // if (e instanceof userDAO.BadDataError) {
//         //   res.status(400).send(e.message);
//         // } else {
//           res.status(500).send(e.message);
//         }
//     //   }
// });

// // login 

// router.post("/", async (req, res, next) => {
//     try {
//         const login = await userDAO.login(req.body);
//         if (login) {
//             res.body = login ;
//             res.status(200).json(res.body);  
//         } else {
//             res.status(401).send('Login Failed');
//         }           
//     } catch(e) {
//         // if (e instanceof userDAO.BadDataError) {
//         //   res.status(400).send(e.message);
//         // } else {
//           res.status(500).send(e.message);
//         // }
//       }
// });

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









module.exports = router;