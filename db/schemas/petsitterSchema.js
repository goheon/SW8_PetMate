import mongoose from 'mongoose';
const { Schema } = mongoose;

const petsitterSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  introduction: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  }
})

export default petsitterSchema;