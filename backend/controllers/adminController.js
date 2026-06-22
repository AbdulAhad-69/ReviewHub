import Review from '../models/Review.js';
import Product from '../models/Product.js';

export const getVerificationQueue = async (req, res, next) => {
    try {
        const pendingReviews = await Review.find({ isVerified: false })
            .populate('userId', 'name email')
            .populate('productId', 'name category')
            .sort('-createdAt');

        res.status(200).json({ success: true, count: pendingReviews.length, data: pendingReviews });
    } catch (error) {
        next(error);
    }
};

export const verifyReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // FIX: Mutate and save. This forces the Review.js post('save') aggregation hook to fire!
        review.isVerified = true;
        await review.save(); 

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

export const rejectReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Trigger the deleteOne hook to recalculate math if needed
        await review.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};