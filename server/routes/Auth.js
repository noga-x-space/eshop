const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//signup
router.post("/signup", async (req, res) => {
  const { userName, password } = req.body;
  //encrypting the passwords:
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signup = await pool.query(
      `INSERT INTO users (user_name, hashed_password) VALUES($1, $2)`,
      [userName, hashedPassword]
    );
    const token = jwt.sign({ userName }, "secret", { expiresIn: "1hr" });
    res.json({ userName, token });
  } catch (err) {
    console.error(err);
    if (err) {
      res.json({ detail: err.detail });
    }
  }
});

//sign in
router.post("/login", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const users = await pool.query("SELECT * FROM users WHERE user_name = $1", [
      userName,
    ]);
    if (!users.rows.length) return res.json({ detail: "User does not exist!" });
    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );
    const token = jwt.sign({ userName }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({ userName: users.rows[0].user_name, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
