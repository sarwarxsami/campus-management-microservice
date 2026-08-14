const jwt = require('jsonwebtoken');

// Expects JWT token in Authorization header
function adminOnly(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "No token provided"
      });
    }

    // Extract token
    const token = authHeader.substring(7);
    
    // Get secret key from environment
    const SECRET_KEY = process.env.JWT_SECRET;
    
    // Verify and decode token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Extract user_type (try both possible field names)
    const user_type = decoded.userType || decoded.user_type;
    
    // Log for debugging
    console.log('Decoded token:', decoded);
    console.log('User type:', user_type);
    
    // Check if user_type exists
    if (user_type === undefined || user_type === null) {
      return res.status(403).json({
        error: "Forbidden",
        message: "User type not found in token"
      });
    }
    
    // Check if user is admin (user_type === "1" or 1)
    // Your JWT might store userType as string or number
    if (String(user_type) !== "1") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Admin access required"
      });
    }
    
    // Attach user info to request for downstream use
    req.user = decoded;
    req.user_type = user_type;
    req.userId = decoded.userId || decoded.id;
    
    next();
    
  } catch (error) {
    // Handle different JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Token expired. Please login again."
      });
    }
    
    // Generic error
    console.error('JWT verification error:', error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Token verification failed"
    });
  }
}

module.exports = adminOnly;