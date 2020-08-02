const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  text: { type: String, required: true },
  userId: { type: String}
});


module.exports = mongoose.model("notes", noteSchema);