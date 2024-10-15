const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    {
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '1h' } 
  );
};

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token.' });
    }
    req.user = decoded;  
    next();
  });
};

module.exports = {
  generateToken,
  verifyToken
};
