const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  phone : {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: String,
    required: true
  },
  subject: [
    {
      type: Schema.Types.ObjectId,
      ref: 'subject'
    }
  ]
});

module.exports = mongoose.model('Student', studentSchema);
