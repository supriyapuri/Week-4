const mongoose = require("mongoose");

const Note = require('../models/note');
const Token = require('../models/token');
const User = require('../models/user');


module.exports = {};


// module.exports.verifyToken = async (auth) =>{
//     const currToken = auth.split(' ')[1];
//     const foundToken = await Token.findOne({token : currToken})
//      if (!foundToken){
//                 return false;
//      } else {
//                 const user =  await User.findOne({ _id : foundToken.userId });
//                 return user._id;
//             }
//     }
module.exports.createNote = async(textData, userId) => {

  const noteText= textData.text
  const NewNote = await Note.create({'text' : noteText, 'userId' : userId});
  return NewNote;
 
}

module.exports.getNotesforUser = async (userId) => {
   const notes = await Note.find({ userId : userId });
   return notes;
}

module.exports.getNoteById = async (noteId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(noteId)) {
        throw new BadDataError('Not valid note id');
    }
    const note = await Note.findOne({ _id : noteId, userId : userId }).lean();
    if (note !== null || !note){
      
  } else {
    return false
  }

};

    
    

class BadDataError extends Error {};
module.exports.BadDataError = BadDataError;


    
    