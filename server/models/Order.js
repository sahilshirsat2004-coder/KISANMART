import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderType: { type: String, enum: ['SPOT', 'FUTURE'], required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  agreedPricePerUnit: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: [
      'PREBOOKED', 'PLACED', 'CONFIRMED', 'READY_FOR_PICKUP',
      'DRIVER_ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'CANCELLED'
    ],
    default: 'PLACED'
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  liveDriverLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [73.8567, 18.5204] }
  }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);
