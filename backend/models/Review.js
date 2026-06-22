import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, minlength: 20 },
    attributes: {
        value: { type: Number, min: 1, max: 5, required: true },
        durability: { type: Number, min: 1, max: 5, required: true },
        features: { type: Number, min: 1, max: 5, required: true }
    },
    receiptUrl: { type: String, default: null }, // URL to the uploaded receipt image (if provided)
    isVerified: { type: Boolean, default: false }, // Flipped to true if receipt is approved
    helpfulCount: { type: Number, default: 0 }
}, { timestamps: true });

// Prevent a user from reviewing the same product twice
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// Static method to get avg rating and save to the Product
reviewSchema.statics.getAverageRating = async function(productId) {
    const obj = await this.aggregate([
        {
            $match: { productId: productId, isVerified: true }
        },
        {
            $group: {
                _id: '$productId',
                averageRating: { $avg: { $avg: ['$attributes.value', '$attributes.durability', '$attributes.features'] } },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        if (obj.length > 0) {
            const avgRating = Math.round(obj[0].averageRating * 10) / 10;
            const totalReviews = obj[0].totalReviews;

            // --- THE WILSON SCORE ALGORITHM ---
            const z = 1.96; // 95% statistical confidence interval
            const phat = avgRating / 5; // Normalize 1-5 stars to a 0-1 percentage
            const n = totalReviews;
            
            // The actual Wilson Score formula
            const wilsonScore = (phat + (z * z) / (2 * n) - z * Math.sqrt((phat * (1 - phat) + (z * z) / (4 * n)) / n)) / (1 + (z * z) / n);

            // Update all three metrics in the Product document
            await this.model('Product').findByIdAndUpdate(productId, {
                'metrics.avgRating': avgRating,
                'metrics.totalReviews': totalReviews,
                'metrics.wilsonScore': wilsonScore // We are no longer ignoring this!
            });
        } else {
            await this.model('Product').findByIdAndUpdate(productId, {
                'metrics.avgRating': 0,
                'metrics.totalReviews': 0,
                'metrics.wilsonScore': 0
            });
        }
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageRating after a review is saved (e.g., approved by admin)
reviewSchema.post('save', function() {
    this.constructor.getAverageRating(this.productId);
});

// Call getAverageRating after a review is destroyed (e.g., rejected by admin)
reviewSchema.post('deleteOne', { document: true, query: false }, function() {
    this.constructor.getAverageRating(this.productId);
});

export default mongoose.model('Review', reviewSchema);