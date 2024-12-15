const express = require("express");
const router = express.Router();
const pool = require("../db");

/////show rates
router.get("/:product/", async (req, res) => {
  const { product } = req.params;
  try {
    // return the avg
    const avg = await pool.query(
      "SELECT COALESCE(AVG(rating), 0) as avg FROM ratings WHERE product_name = $1",
      [product]
    );
    res.json(avg.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
});

/// show distinct number of shoppers of the product
router.get("/buyers/:product", async (req, res) => {
  const { product } = req.params;
  try {
    // return the avg
    const response = await pool.query(
      "SELECT COUNT(*) FROM ratings WHERE product_name = $1",
      [product]
    );
    res.json(response.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch buyers count" });
  }
});

/////rate
router.post("/:userName/:product/", async (req, res) => {
  const { userName, product } = req.params;
  const { rating } = req.body; // Assuming the rating value is sent in the request body

  // const rating = 5;

  try {
    // Check if the user has purchased the product
    const purchaseCheck = await pool.query(
      "SELECT COUNT(product_name) FROM purchasedetails WHERE user_name = $1 AND product_name = $2",
      [userName, product]
    );
    const hasUserPurchased = purchaseCheck.rows[0].count > 0;

    if (!hasUserPurchased) {
      return res
        .status(403)
        .json({ error: "User must purchase the product to rate it." });
    }

    // Check if the user has already rated this product
    const ratingCheck = await pool.query(
      "SELECT rating FROM ratings WHERE user_name = $1 AND product_name = $2",
      [userName, product]
    );

    if (ratingCheck.rowCount > 0) {
      // User has already rated, update the existing rating
      await pool.query(
        "UPDATE ratings SET rating = $1 WHERE user_name = $2 AND product_name = $3",
        [rating, userName, product]
      );
      return res.json({ message: "Rating updated successfully." });
    } else {
      // User has not rated yet, insert a new rating
      await pool.query(
        "INSERT INTO ratings (user_name, product_name, rating) VALUES ($1, $2, $3)",
        [userName, product, rating]
      );
      return res.json({ message: "Rating added successfully." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to rate the product" });
  }
});
module.exports = router;
