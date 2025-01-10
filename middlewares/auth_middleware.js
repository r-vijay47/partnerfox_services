const SECRET_KEY = "your_secret_key"; // Replace with a secure key
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized access. Token is missing." });
    }
   // console.log(authHeader)

    const token = authHeader.split(" ")[1]; // Extract token
  


    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      console.log(decoded)
      req.user = decoded; // Add user info to request object
      next();
    } catch (error) {
      console.log(error)
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  };
  
  module.exports = authMiddleware;
  