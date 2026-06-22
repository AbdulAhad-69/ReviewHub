import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - Verifies the JWT
export const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies
    if (req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token || token === 'none') {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token logic
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user to request object
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Session invalid or expired' });
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `User role '${req.user.role}' is not authorized to access this route` 
            });
        }
        next();
    };
};