import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Get all unverified reviews (The Moderation Queue)
// @route   GET /api/v1/admin/queue
// @access  Private/Admin
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

// @desc    Approve a review (Grant Verified Status)
// @route   PUT /api/v1/admin/verify/:reviewId
// @access  Private/Admin
export const verifyReview = async (req, res, next) => {
    try {
        const review = await Review.findByIdAndUpdate(
            req.params.reviewId,
            { isVerified: true },
            { returnDocument: 'after', runValidators: true }
        );

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        // Note: In a fully scaled system, we would re-run the aggregate math here 
        // to give this verified review a 1.5x multiplier in the Wilson Score.

        res.status(200).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject and delete a review
// @route   DELETE /api/v1/admin/reject/:reviewId
// @access  Private/Admin
export const rejectReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: 'Review not found' });
        }

        await review.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};