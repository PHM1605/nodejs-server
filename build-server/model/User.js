const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  roles: {
    User: {
      type: Number,
      default: 2001
    },
    Editor: Number,
    Admin: Number
  },
  password: {
    type: String,
    required: true
  },
  refreshToken: String
});

// By default, MongoDB will take the model name, convert to lowercase and add 's' to the end i.e. 'User'->'users' that is the "collection" name
module.exports = mongoose.model('User', userSchema)