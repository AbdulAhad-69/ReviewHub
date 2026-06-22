import Review from '../models/Review.js';
import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

export const createReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const { content, attributes } = req.body;

        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        let uploadedReceiptUrl = null;

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

        // FIX: Remove the manual aggregation. Just create the review. 
        // It stays unverified, protecting the Wilson Score until Admin approval.
        const review = await Review.create({
            productId,
            userId: req.user.id,
            content,
            attributes: JSON.parse(attributes), 
            receiptUrl: uploadedReceiptUrl,
            isVerified: false 
        });

        res.status(201).json({ success: true, data: review });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
        }
        next(error);
    }
};

export const getProductReviews = async (req, res, next) => {
    try {
        // Only return verified reviews to the public feed
        const reviews = await Review.find({ productId: req.params.productId, isVerified: true })
            .populate('userId', 'name role reputationScore')
            .sort('-helpfulCount -createdAt');

        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};