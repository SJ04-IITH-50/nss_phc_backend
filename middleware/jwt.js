const jwt = require("jsonwebtoken");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET_KEY;

const generateToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      role: user.role,
      hospital_id: user.hospital_id,
    },
    JWT_SECRET
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided." });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Failed to authenticate token." });
    }
    req.user = decoded;
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken,
};
