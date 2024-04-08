import mongoose from 'mongoose';
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  sitterId: {
    type: String,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },

})

export default orderSchema;