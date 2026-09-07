import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Vegetables', 'Fruits', 'Grains', 'Pulses'], required: true },
  pricePerUnit: { type: Number, required: true, min: 1 },
  unit: { type: String, enum: ['kg', 'quintal', 'crate'], default: 'kg' },
  type: { type: String, enum: ['SPOT', 'FUTURE'], required: true },
  availableQuantity: { type: Number, required: true, min: 0 },
  reservedQuantity: { type: Number, default: 0, min: 0 },
  expectedHarvestDate: { type: Date, default: null },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [73.8567, 18.5204] }
  },
  images: [{ type: String }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

productSchema.index({ location: '2dsphere' });
export const Product = mongoose.model('Product', productSchema);
