import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Category name cannot be more than 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for better performance
categorySchema.index({ name: 1 });

export default mongoose.model('Category', categorySchema); 