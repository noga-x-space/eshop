const jwt = require("jsonwebtoken");

// const verifyToken = (req, res, next) => {
//   const token = req.header("Authorization");
//   if (!token) return res.status(401).json({ message: "Access Denied" });

//   try {
//     // if a token exists - is it valid?
//     const verified = jwt.verify(token, "secret");
//     req.user = verified; // keeping the user info
//     next(); // continue to the next route function
//   } catch (err) {
//     res.status(400).json({ message: "Invalid Token" });
//   }
// };
const verifyAdmin = (req, res, next) => {
  //need to make sure the users db has roles
  if (req.user.userRole !== "ADMIN") {
    return res.status(403).json({ message: "Access forbidden: Admins only" });
  }
  next();
};

module.exports = verifyAdmin;
