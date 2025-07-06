import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  material: {
    type: Number,
    required: [true, 'Material number is required'],
    unique: true
  },
  barcode: {
    type: String,
    required: [true, 'Barcode is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  category: {
    type: String,
    default: 'Uncategorized',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: true, updatedAt: true }
});

// Update the updatedAt field before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better search performance
productSchema.index({ barcode: 1 });
productSchema.index({ material: 1 });
productSchema.index({ category: 1 });
productSchema.index({ description: 'text' });

export default mongoose.model('Product', productSchema); 