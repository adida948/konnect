const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, lowercase: true }
});

module.exports = mongoose.model('user', userSchema);
