const express = require("express");
const router = express.Router();
const pool = require("../db");

///// show prev purchases
router.get("/:user/", async (req, res) => {
  const { user } = req.params;
  try {
    const result = await pool.query(
      "SELECT pd.product_name, p.description, p.price, p.image \
         FROM purchasedetails pd \
         JOIN products p ON pd.product_name = p.product_name \
         WHERE pd.user_name = $1",
      [user]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch purchases" });
  }
});

module.exports = router;
