import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { calculateWilsonScore } from '../utils/mathUtils.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Submit a new review
// @route   POST /api/v1/products/:productId/reviews
// @access  Private
export const createReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { content, attributes } = req.body;

        // 1. Ensure the product exists
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        let uploadedReceiptUrl = null;

        // If a file was attached, upload it to Cloudinary
        if (req.file) {
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'reviewhub_receipts' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(req.file.buffer);
            });
            uploadedReceiptUrl = await uploadPromise;
        }

        // 2. Create the review
        const review = await Review.create({
            productId,
            userId: req.user.id,
            content,
            attributes: JSON.parse(req.body.attributes), // Multer converts nested objects to strings, so we parse it back
            receiptUrl: uploadedReceiptUrl,
            isVerified: false // Always false initially; requires Admin approval
        });

        // 3. Aggregate new metrics for the Product
        const stats = await Review.aggregate([
            { $match: { productId: product._id } },
            {
                $group: {
                    _id: '$productId',
                    totalReviews: { $sum: 1 },
                    avgValue: { $avg: '$attributes.value' },
                    avgDurability: { $avg: '$attributes.durability' },
                    avgFeatures: { $avg: '$attributes.features' }
                }
            }
        ]);

        if (stats.length > 0) {
            const overallAvg = (stats[0].avgValue + stats[0].avgDurability + stats[0].avgFeatures) / 3;

            // Re-calculate Wilson Score based on verified status or helpful upvotes (simplified here to total count for initial implementation)
            const newWilsonScore = calculateWilsonScore(stats[0].totalReviews, stats[0].totalReviews);

            await Product.findByIdAndUpdate(productId, {
                metrics: {
                    avgRating: overallAvg.toFixed(2),
                    totalReviews: stats[0].totalReviews,
                    wilsonScore: newWilsonScore
                }
            });
        }

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        // Handle duplicate review error
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }
        next(error);
    }
};

// @desc    Get reviews for a product
// @route   GET /api/v1/products/:productId/reviews
// @access  Public
export const getProductReviews = async (req, res, next) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('userId', 'name role reputationScore')
            .sort('-helpfulCount -createdAt'); // Sort by most helpful first

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};