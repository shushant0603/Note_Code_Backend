import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  console.log("Auth middleware: Checking request to:", req.path);
  console.log("Auth middleware: Headers:", req.headers);
  
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
      console.log("Auth middleware: Token found:", token ? "Yes" : "No");
    }

    if (!token) {
      console.log("Auth middleware: No token provided");
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("Auth middleware: Token decoded successfully, user ID:", decoded.id);
      req.user = await User.findById(decoded.id).select('-password');
      console.log("Auth middleware: User found:", req.user ? "Yes" : "No");
      next();
    } catch (error) {
      console.log("Auth middleware: Token verification failed:", error.message);
      return res.status(401).json({ message: 'Not authorized to access this route' });
    }
  } catch (error) {
    console.error("Auth middleware: Server error:", error);
    res.status(500).json({ message: 'Server error' });
  }
}; 