const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/UserDB")
.then(()=>{
  console.log('feedbackDB connected')
})
.catch(()=>{
  console.log('failed')
})

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  massege: String
});

const User = mongoose.model('Feedback', userSchema);

module.exports = User;