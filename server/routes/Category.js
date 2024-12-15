const express = require("express");
const router = express.Router();
const pool = require("../db");

//show catagories
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM CATEGORIES LIMIT 8");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

//filter based on category
router.get("/:categoryID", async (req, res) => {
  const catID = req.params.categoryID;
  try {
    const result = await pool.query(
      "SELECT * from products WHERE products.category_id=$1;",
      [catID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
