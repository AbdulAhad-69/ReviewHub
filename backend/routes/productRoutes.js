import express from 'express';
import { getProducts, getProductById } from '../controllers/productController.js';
import { createReview, getProductReviews } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Base Product Routes
router.route('/')
    .get(getProducts);

router.route('/:id')
    .get(getProductById);

// Re-route into Review controllers
router.route('/:productId/reviews')
    .get(getProductReviews)
    .post(protect, upload.single('receipt'), createReview);

export default router;