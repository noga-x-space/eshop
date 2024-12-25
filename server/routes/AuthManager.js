const pool = require("../db");

const authManager = async (req, res, next) => {
  try {
    // Extract the username from cookies
    const username = req.cookies?.UserName;

    // Check if username is missing
    if (!username) {
      return res
        .status(401)
        .json({ error: "Unauthorized: No username provided" });
    }

    // Check user privileges
    const roleResult = await pool.query(
      "select role from users where user_name= $1",
      [username]
    );
    const role = roleResult.rows[0].role;
    if (role == "admin") {
      next(); // Proceed to the next middleware or route handler
    }
    if (role !== "admin") {
      return res
        .status(403)
        .json({ error: "Access denied: Insufficient permissions" });
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = authManager;
