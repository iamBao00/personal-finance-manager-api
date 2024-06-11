const adminOnly = (req, res, next) => {
  if (req.user && req.user.admin) {
    next();
  } else {
    res.status(403).json({ message: "Access denied" });
  }
};

export default adminOnly;
