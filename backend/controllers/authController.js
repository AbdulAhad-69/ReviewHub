import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper function to generate token and send secure cookie
const sendTokenResponse = (user, statusCode, res) => {
    // Generate JWT payload
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '30d'
    });

    const options = {
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 Days
        httpOnly: true, // Prevents XSS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    };

    user.password = undefined; // Remove password from response

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        user
    });
};

// @desc    Register a user
// @route   POST /api/v1/auth/register
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        const user = await User.create({ name, email, password });
        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error); // This will now correctly pass to the global error handler
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Log user out / clear cookie
// @route   POST /api/v1/auth/logout
export const logout = async (req, res, next) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({ success: true, data: {} });
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
export const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, user });
    } catch (error) {
        next(error);
    }
};