import Product from '../models/Product.js';

// @desc    Get all products (with filtering & sorting)
// @route   GET /api/v1/products
// @access  Public
export const getProducts = async (req, res, next) => {
    try {
        // Advanced filtering setup (e.g., ?category=Electronics)
        const reqQuery = { ...req.query };
        const removeFields = ['sort', 'page', 'limit'];
        removeFields.forEach(param => delete reqQuery[param]);

        let queryStr = JSON.stringify(reqQuery);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        let query = Product.find(JSON.parse(queryStr));

        // Default sorting relies on our pre-calculated Wilson Score for reliability
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-metrics.wilsonScore'); 
        }

        const products = await query;
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single product
// @route   GET /api/v1/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

        // Just return the product. The database hook ensures the metrics are already accurate!
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};