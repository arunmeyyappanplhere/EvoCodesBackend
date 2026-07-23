const jwt = require("jsonwebtoken");

// Reads the httpOnly "token" cookie set at login/register, verifies it,
// and attaches the decoded payload to req.admin for downstream handlers.
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded; // { id, userID, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Session expired or invalid. Please log in again." });
  }
};

module.exports = authMiddleware;