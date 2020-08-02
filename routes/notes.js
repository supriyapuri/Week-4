const mongoose = require("mongoose")
const { Router } = require("express");
const router = Router();

const noteDAO = require('../daos/note');
const userDAO = require('../daos/user');
const tokenDAO = require('../daos/token');



router.use(async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send('Missing token');
    }
    else{
    const token  = req.headers.authorization.split(' ')[1];
    req.token= token;
    if(req.token){
      const userId = await tokenDAO.tokenUser(req.token);
      if (!user) {
        return res.status(401).send('invalid token');
      } else {
        req.userId = userId;
        next();
      }
    }else {
      res.sendStatus(401);
  }
} 

});


// create notes
router.post("/", async (req, res, next) => {
    const note = req.body;
    if (!req.token) {
      res.status(401).send('You don\'t have a token.');
  }else {
    if (!note || JSON.stringify(note) === '{}' ) {
      res.status(400).send('note is required');
    } else {
      try {
        const savedNote = await noteDAO.createNote(req.body.text, req.userId);
        res.status(200);
        res.json(savedNote); 
      } catch(e) {
        if (e instanceof noteDAO.BadDataError) {
          res.status(400).send(e.message);
        } else {
          res.status(500).send(e.message);
        }
      }
    }
  }
  });

  // get notes for a user

  router.get("/", async (req, res, next) => {
    try {
      const user = req.userId;

      if (!req.token) {
        res.status(401).send('You don\'t have a token.');
      }
      else if (!user) {
        res.status(404).send('Access denied');
      }
      else{
        const notes = await noteDAO.getNotesforUser(req.userId);
        res.json(notes);
      }
    } catch(e) {
      if (e instanceof notesDAO.BadDataError) {
          res.status(400).send(e.message);
        } else {
          res.status(500).send(e.message);
        }
      }
    
});


//get note by Id


router.get("/:id", async (req, res, next) => {
    try{  
    const user = req.userId;

    if (!req.token) {
      res.status(401).send('You don\'t have a token.');
    }
    else if (!user) {
      res.status(404).send('Access denied');
    }
    else{
      const notes = await noteDAO.getNoteById(req.params.id, req.userId);
      if (notes) {
        res.json(notes);
      } else {
        res.status(404).send('note not found');
      }
    }

    } catch(e) {
        if (e instanceof noteDAO.BadDataError) {
          res.status(400).send(e.message);
        } else {
          res.status(500).send(e.message);
        }
      }
  
  });


module.exports = router;