import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['FARMER', 'SHOPKEEPER', 'DRIVER', 'ADMIN'], 
    default: 'FARMER' 
  },
  address: {
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' }
  }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);