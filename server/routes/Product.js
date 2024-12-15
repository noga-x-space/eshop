const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/", async (req, res) => {
  try {
    const products = await pool.query(
      "SELECT *, categories.category FROM products INNER JOIN Categories ON products.category_id = categories.category_id WHERE products.quantity_in_stock>0"
    );
    res.json(products.rows);
  } catch (err) {
    console.error(err);
  }
});

//get main image
router.get("/:name/image", async (req, res) => {
  const productName = req.params.name;

  if (!productName) {
    return res.status(400).send("Missing product name");
  }

  try {
    const result = await pool.query(
      "SELECT image FROM Products WHERE product_name = $1",
      [productName]
    );

    if (result.rows.length > 0) {
      const imageBuffer = result.rows[0].image;

      res.set("Content-Type", "image/png");
      res.send(imageBuffer);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});
module.exports = router;
