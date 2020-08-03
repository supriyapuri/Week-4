
const { Router } = require("express");
const router = Router();
	

const userDAO = require('../daos/user');


//logout

router.post("/logout", async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing token');
    }
    try {
        const success = await userDAO.logout(req.headers.authorization);
        if (success) {
            res.status(200).send('logout successful')
        } else {
            res.status(401).send('Invalid Token')
        }
    } catch(e) {
          res.status(500).send(e.message);
        }
 
});

// password change

router.post('/password', async (req, res) =>{
    if (!req.headers.authorization) {
        return res.status(401).send('Token not available');
        
    } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('Password required');
    } else {
        try {
            const token = req.headers.authorization;
            const password = req.body.password;
            const success = await userDAO.changePassword(token, password);
            if (success) {
	                res.status(200).send('Password changed');
	            } else {
	                res.status(401).send('Password not changed');
	            }
	        } catch (error) {
	            res.status(500).send(error.message);    
	        }
	    }
});
	
// middleware

router.use(async (req, res, next) => {
    if (!req.body.email || JSON.stringify(req.body.email) === '{}') {
        res.status(400).send('Email Required');
    } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('Password Required');
    } else {
        next();
    }
});


// signup

router.post("/signup", async (req, res) => {
    try {
        
        // checking if the user exists
        // const emailExist = await User.findOne({email: req.body.email});
        // if (emailExist){
        //     res.status(409).send('Email already exists');
        // }

        
        const user = await userDAO.signUp(req.body);
        if (user) {
            res.status(200).send('Account Created');
        } else {
            res.status(409).send('User already exists');
        }
           
    } catch(e) {
          res.status(500).send(e.message);
        }

});

// login 

router.post("/", async (req, res, next) => {
    try {
        const success = await userDAO.login(req.body);
        if (success) {
            res.body = success ;
            res.status(200).json(res.body);  
        } else {
            res.status(401).send('Login Failed');
        }           
    } catch(e) {
          res.status(500).send(e.message);
        }
      
});

module.exports = router;