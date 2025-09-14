
// backend/middleware/validateRecentDate.js
module.exports = function(req, res, next){
  const dateFields = ['date','startDate','claimDate'];
  const now = new Date();
  const errors = [];

  dateFields.forEach(field=>{
    if (req.body[field]) {
      const d = new Date(req.body[field]);
      const diffDays = (now - d) / (1000*60*60*24);
      if (diffDays > 30) errors.push(`${field} cannot be older than 30 days`);
      if (d > now) errors.push(`${field} cannot be in the future`);
    }
  });

  if (errors.length) return res.status(400).json({ errors });
  next();
};
