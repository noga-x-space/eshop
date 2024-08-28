const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

app.use(cors());
app.use(express.json());

//show all users
app.get("/getusers", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM Users");
    res.json(users.rows);
    console.log("users.rows");
    console.log(users.rows);
  } catch (err) {
    console.error(err);
  }
});

////////sign up/in //

//signup
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
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

//show all products
app.get("/products", async (req, res) => {
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
app.get("/products/:name/image", async (req, res) => {
  const productName = req.params.name;

  console.log("Request received for product image:", req.params.name);

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
      //   const base64Image = imageBuffer.toString("base64");

      res.set("Content-Type", "image/png"); // Adjust based on your image type
      //   res.send(base64Image);

      //   console.log("Image buffer:", imageBuffer); // Log the image buffer data
      res.send(imageBuffer);
    } else {
      res.status(404).send("Image not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

//show catagories
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories " //where
    );
    res.json(result.rows);
    console.log("cart.rows: ", result.rows);
  } catch (err) {
    console.error(err);
  }
});

//filter based on category
app.get("/categories/:categoryID", async (req, res) => {
  const catID = req.params.categoryID;
  try {
    const result = await pool.query(
      // "SELECT * from products WHERE products.category_id=(SELECT category_id FROM categories WHERE\
      // category=$1);",
      "SELECT * from products WHERE products.category_id=$1;",
      [catID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
  }
});

///show cart
app.get("/cart/:userName/", async (req, res) => {
  const { userName } = req.params;
  console.log(userName);

  try {
    const result = await pool.query(
      "SELECT cartdetails.product_name, cartdetails.quantity, (CAST(price AS numeric) * cartdetails.quantity) as price FROM cartDetails inner join products on products.product_name=cartdetails.product_name WHERE user_name = $1 ",
      [userName]
    );
    res.json(result.rows);
    console.log("cart.rows: ", result.rows);
  } catch (err) {
    console.error(err);
  }
});

//count cart items
app.get("/cartitems/:userName/", async (req, res) => {
  const { userName } = req.params;
  console.log(userName);

  try {
    const result = await pool.query(
      "SELECT SUM(quantity) FROM CARTDETAILS WHERE user_name = $1   ",
      [userName]
    );
    res.json(result.rows[0].sum);
    console.log("cart items: ", result.rows[0].sum);
  } catch (err) {
    console.error(err);
  }
});

///// add to cart
app.post("/cart/:userName/:product/", async (req, res) => {
  const { userName, product } = req.params;
  console.log(userName, product);
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
        console.log(cartId);
      }
      console.log("theee cart id isss: ", cartId);

      //by this point we already have the cart id record that matches from the carts table.
      //insert the product into the cartdetails table
      await pool.query(
        "INSERT INTO CARTDETAILS (cart_id, product_name, quantity, user_name) VALUES($1, $2, $3, $4)",
        [cartId, product, 1, userName]
      );
      res.json({ message: "Product added to cart" });
    }
  } catch (err) {
    console.error("Error adding product to cart:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

app.get("/delete/:userName/:product/", async (req, res) => {
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

// ADMIN- change values of table
// app.get("/changeproduct:id", async (req, res) => {
//   try {
//     const { pID } = req.params.id;
//     const { valueList, valueNames } = req.body;
//     const changedProduct = await pool.query(
//       "UPDATE {$1} WHERE VALUES($2）WHERE products.id=pID "
//     );
//     res.json(products.rows);
//   } catch (err) {
//     console.error(err);
//   }
// });

app.listen(PORT, console.log(`listening on port ${PORT}`));

/////////// users ///////////

//create a user

// app.post("/signup", async (req, res) => {
//   const { userName, password } = req.body;
//   //encrypting the passwords:
//   const salt = bcrypt.genSaltSync(10);
//   const hashedPassword = bcrypt.hashSync(password, salt);

//   try {
//     const signup = await pool.query(
//       `INSERT INTO users (user_name, hashed_password) VALUES($1, $2)`,
//       [userName, hashedPassword]
//     );
//     const token = jwt.sign({ userName }, "secret", { expiresIn: "1hr" });
//     res.json({ userName, token });
//   } catch (err) {
//     console.error(err);
//     if (err) {
//       res.json({ detail: err.detail });
//     }
//   }
// });

//show all users
// app.get("/getusers", async (req, res) => {
//   try {
//     const users = await pool.query("SELECT * FROM Users");
//     res.json(users.rows);
//     console.log(users.rows);
//   } catch (err) {
//     console.error(err);
//   }
// });
