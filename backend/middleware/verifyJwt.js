
// backend/middleware/verifyJwt.js
const jwt = require('jsonwebtoken');
module.exports = function(req, res, next){
  const header = req.header('Authorization') || '';
  const token = header.replace('Bearer ','').trim();
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'replace_this_secret');
    req.auth = payload;
    next();
  } catch (e) {
    console.error('JWT verify failed', e.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};
