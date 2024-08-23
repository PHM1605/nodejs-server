const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  }
});

// By default, MongoDB will take the model name, convert to lowercase and add 's' to the end i.e. 'Employee'->'employees' that is the "collection" name
module.exports = mongoose.model('Employee', employeeSchema)