import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',   // reference to User collection
    required: true 
  },
  language: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  algo: {
    type: String,
    required: false, // Make it optional
    default: '', // Default to empty string
  },
  input: {
    type: String,
    required: false,
    default: '',
  },
  output: {
    type: String,
    required: false,
    default: '',
  },

}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

export default File;
