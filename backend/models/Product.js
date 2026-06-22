import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    imageUrl: { type: String }, // Public Cloudinary URL
    specs: { type: Map, of: String }, // Flexible key-value pairs (e.g., "RAM": "16GB")
    metrics: {
        avgRating: { type: Number, default: 0 },
        totalReviews: { type: Number, default: 0 },
        wilsonScore: { type: Number, default: 0 } // For advanced sorting
    }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);