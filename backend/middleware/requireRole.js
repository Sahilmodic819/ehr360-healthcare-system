// backend/middleware/requireRole.js
module.exports = function(...roles){
  return function(req,res,next){
    if (!req.auth) return res.status(401).json({ error: 'Not authenticated' });
    if (!roles.includes(req.auth.role)) return res.status(403).json({ error: 'Forbidden' });
    next();
  }
}
