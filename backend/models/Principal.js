const mongoose = require('mongoose');

const principalSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
});

module.exports = mongoose.model('Principal', principalSchema);
