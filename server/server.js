const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const pool = require("./db");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

app.use(cors());
app.use(express.json());
// app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello from backend API!");
  console.log(`Server is running on port ${PORT}`);
});

////////////////////////////users
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

/////////////////////////////////products
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

  // console.log("Request received for product image:", req.params.name);

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
////////// SHOULD BE CHANGED
app.get("/categories", async (req, res) => {
  try {
    const result = await pool.query(
      // "SELECT TOP 3 FROM categories " //where
      "SELECT * FROM CATEGORIES LIMIT 8"
    );
    res.json(result.rows);
    // console.log("cat.rows: ", result.rows);
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

/////////////////////cart
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
////////////////////missing functionality: in how many carts- look at products tbl
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

////////////////////////////// purchase
// this function updates the purchases table and cleans the cart, updates products table
app.get("/checkout/:userName", async (req, res) => {
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
      console.log(purId);
    }
    console.log("theee purchase id isss: ", purId);

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

///// show prev purchases
app.get("/purchases/:user/", async (req, res) => {
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

//////////////////////////////ratings

/////show rates
app.get("/rate/:product/", async (req, res) => {
  const { product } = req.params;
  try {
    // return the avg
    const avg = await pool.query(
      "SELECT COALESCE(AVG(rating), 0) as avg FROM ratings WHERE product_name = $1",
      [product]
    );
    console.log("the avg rating is: ", avg.rows[0]);
    res.json(avg.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch average rating" });
  }
});

/// show distinct number of shoppers of the product
app.get("/buyers/:product", async (req, res) => {
  const { product } = req.params;
  try {
    // return the avg
    const response = await pool.query(
      "SELECT COUNT(*) FROM ratings WHERE product_name = $1",
      [product]
    );
    // console.log("buyers' result: ", response.rows[0]);
    res.json(response.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch buyers count" });
  }
});

/////rate
app.post("/rate/:userName/:product/", async (req, res) => {
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

// app.listen(PORT, console.log(`listening on port ${PORT}`));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});