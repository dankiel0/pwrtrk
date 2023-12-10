const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) {
    return res.status(403).send("A token is required for authentication");
  }
  const token = header.split(' ')[1]; // Splitting "Bearer <token>"
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;
