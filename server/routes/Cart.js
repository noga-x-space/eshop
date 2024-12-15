const express = require("express");
const router = express.Router();
const pool = require("../db");

///show cart
router.get("/:userName/", async (req, res) => {
  const { userName } = req.params;

  try {
    const result = await pool.query(
      "SELECT cartdetails.product_name, cartdetails.quantity, (CAST(price AS numeric) * cartdetails.quantity) as price FROM cartDetails inner join products on products.product_name=cartdetails.product_name WHERE user_name = $1 ",
      [userName]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

//count cart items
router.get("/:userName/items", async (req, res) => {
  const { userName } = req.params;

  try {
    const result = await pool.query(
      "SELECT SUM(quantity) FROM CARTDETAILS WHERE user_name = $1   ",
      [userName]
    );
    res.json(result.rows[0].sum);
  } catch (err) {
    console.error(err);
  }
});

///// add to cart
////want to add functionality: in how many carts- look at products tbl
router.post("/:userName/:product/", async (req, res) => {
  const { userName, product } = req.params;
  try {
    const result = await pool.query(
      "SELECT cart_details_id, quantity FROM cartDetails WHERE user_name = $1 AND product_name = $2 ",
      [userName, product]
    );

    //if the product already exists, add one to it
    if (result.rows.length > 0) {
      // isincart=true;
      const cartDetailsId = result.rows[0].cart_details_id;
      const currentQuantity = result.rows[0].quantity;
      const updatedQuantity = currentQuantity + 1;

      await pool.query(
        "UPDATE cartdetails SET quantity = $1 WHERE cart_details_id = $2",
        [updatedQuantity, cartDetailsId]
      );
      res.json({ message: "Product quantity updated" });
    } else {
      //product doesn't exist in user cart
      //does the user have a cart?
      const isCartExists = await pool.query(
        "select cart_id from carts where user_name= $1",
        [userName]
      );
      const cartId =
        isCartExists.rows.length > 0 ? isCartExists.rows[0].cart_id : null;

      //in this case we don't have a cart, and we should create one
      if (!cartId) {
        const createCartResult = await pool.query(
          "INSERT INTO carts (user_name) VALUES ($1) RETURNING cart_id",
          [userName]
        );
        cartId = createCartResult.rows[0].cart_id;
      }

      //by this point we already have the cart id record that matches from the carts table.
      //insert the product into the cartdetails table

      //we need to get the category id of the product
      catID = await pool.query(
        "SELECT category_id FROM products WHERE product_name=$1",
        [product]
      );
      catID = catID.rows[0].category_id;

      await pool.query(
        "INSERT INTO CARTDETAILS (cart_id, product_name, quantity, user_name, category_id) VALUES($1, $2, $3, $4, $5)",
        [cartId, product, 1, userName, catID]
      );
      res.json({ message: "Product added to cart" });
    }
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

//delete from cart
router.get("/delete/:userName/:product/", async (req, res) => {
  const { userName, product } = req.params;
  try {
    const deleted = await pool.query(
      "DELETE FROM cartdetails WHERE user_name = $1 AND product_name = $2 ",
      [userName, product]
    );
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error(err);
  }
});

module.exports = router;
