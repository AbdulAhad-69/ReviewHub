import express from 'express';
import { getVerificationQueue, verifyReview, rejectReview } from '../controllers/adminController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply protection to ALL routes in this file
router.use(protect);
router.use(authorize('admin'));

router.route('/queue').get(getVerificationQueue);
router.route('/verify/:reviewId').put(verifyReview);
router.route('/reject/:reviewId').delete(rejectReview); // Ensure this line exists

export default router;