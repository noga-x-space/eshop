const express = require("express");
const router = express.Router();
const pool = require("../db");


// update the purchases & products tables and cleans the cart
router.get("/:userName", async (req, res) => {
  const { userName } = req.params;
  try {
    /////first- does the user has the user made a purchase? if not, let's insert into purchases

    const hasPreviousPur = await pool.query(
      "select purchase_id from purchases where user_name= $1",
      [userName]
    );
    let purId =
      hasPreviousPur.rows.length > 0
        ? hasPreviousPur.rows[0].purchase_id
        : null;

    //in this case we don't have a purchase record, and we should create one
    if (!purId) {
      const createPurResult = await pool.query(
        "INSERT INTO purchases (user_name) VALUES ($1) RETURNING purchase_id",
        [userName]
      );
      purId = createPurResult.rows[0].purchase_id;
    }

    //by this point we already have the purchase id record that matches from the purchases table.
    //insert the cartDetails into the purchaseDetails table
    await pool.query(
      "INSERT INTO purchasedetails (purchase_id, product_name, quantity, user_name, category_id)\
         SELECT\
         $1, cd.product_name, cd.quantity, cd.user_name, cd.category_id\
         FROM  cartdetails cd\
         WHERE cd.user_name=$2",
      [purId, userName]
    );

    // Update the products table based on cart details
    await pool.query(
      `
        UPDATE products
        SET 
          quantity_in_stock = quantity_in_stock - cd.quantity,
          purchased_units = purchased_units + cd.quantity
        FROM cartdetails cd
        WHERE products.product_name = cd.product_name AND cd.user_name = $1
      `,
      [userName]
    );

    //then, delete the rows in carts and in cartDetails with the same userName
    await pool.query(
      "DELETE FROM cartdetails WHERE user_name = $1;\
        -- DELETE FROM carts WHERE cart_id = [cart_id];",
      [userName]
    );

    res.json({ message: "Products purchased" });
  } catch (err) {
    console.error("Error purchasing:", err);
    res.status(500).json({ error: "Failed to purchase" });
  }
});
module.exports = router;
