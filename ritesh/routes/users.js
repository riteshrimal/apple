const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");

mongoose.connect("mongodb+srv://businesriteshrimal:sa6tTX5rYcFPEpnQ@ritesh.62l1wcx.mongodb.net/?retryWrites=true&w=majority&appName=ritesh");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  fullname: String,
  dp: {
    type: String,
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  }]
});

userSchema.plugin(plm);
module.exports= mongoose.model('User', userSchema);
