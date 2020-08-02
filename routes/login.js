
const { Router } = require("express");
const router = Router();
	

const userDAO = require('../daos/user');


//logout

router.post("/logout", async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing token');
    }
    try {
        const logout = await userDAO.logout(req.headers.authorization);
        if (logout) {
            res.status(200).send('logout successful')
        } else {
            res.status(401).send('Invalid Token')
        }
    } catch(e) {
        // if (e instanceof userDAO.BadDataError) {
        //   res.status(400).send(e.message);
        // } else {
          res.status(500).send(e.message);
        }
    //   }
});

// password change

router.post('/password', async (req, res) =>{
    if (!req.headers.authorization) {
        return res.status(401).send('Missing token');
    
    } else if (!req.body.password || JSON.stringify(req.body.password) === '{}') {
        res.status(400).send('Password required');
    } else {
        try {
            const token = req.headers.authorization;
            const password = req.body.password;
            const success = await userDAO.changePassword(token, password);
            if (success) {
                res.status(200).send('Password changed');
            }

        } catch(e) {
            // if (e instanceof userDAO.BadDataError) {
            //   res.status(400).send(e.message);
            // } else {
              res.status(500).send(e.message);
            }
        //   }
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
        // if (e instanceof userDAO.BadDataError) {
        //   res.status(400).send(e.message);
        // } else {
          res.status(500).send(e.message);
        }
    //   }
});

// login 

router.post("/", async (req, res, next) => {
    try {
        const login = await userDAO.login(req.body);
        if (login) {
            res.body = login ;
            res.status(200).json(res.body);  
        } else {
            res.status(401).send('Login Failed');
        }           
    } catch(e) {
        // if (e instanceof userDAO.BadDataError) {
        //   res.status(400).send(e.message);
        // } else {
          res.status(500).send(e.message);
        // }
      }
});









module.exports = router;