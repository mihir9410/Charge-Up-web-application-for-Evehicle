const mongoose = require('mongoose');
const pln = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/Massages");

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  secret: String
});

userSchema.plugin(pln);
const User = mongoose.model('User', userSchema);

module.exports = User;
