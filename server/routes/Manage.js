const express = require("express");
const router = express.Router();
const pool = require("../db");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser"); // Parse cookies
const authManager = require("./AuthManager");

// Multer storage configuration for file handling
const storage = multer.memoryStorage(); // Store file in memory
// const upload = multer({ storage: storage });

// Middleware for authenticating manager access
router.use(cookieParser()); // Enable cookie parsing
router.use(authManager);

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed"));
  },
});

//show all users
router.get("/", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM Users");
    res.json(users.rows);
  } catch (err) {
    console.error(err);
  }
});

//add product
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { name, category, price, description, stock } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null; // Store image as buffer

    // If no image is uploaded, handle it accordingly
    if (!imageBuffer) {
      return res.status(400).json({ error: "Image is required" });
    }

    //get the category_id from the chosen category name
    const categoryQuery = await pool.query(
      "SELECT category_id FROM categories WHERE category = $1",
      [category]
    );
    const categoryId = categoryQuery.rows[0]?.category_id;

    const result = await pool.query(
      `INSERT INTO products (product_name, category, price, description, quantity_in_stock, image, category_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [name, category, price, description, stock, imageBuffer, categoryId]
    );

    res
      .status(201)
      .json({ message: "Product added successfully", product: result.rows[0] });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

//add category
router.post("/category", async (req, res) => {
  try {
    const category = req.params;

    const result = await pool.query(
      "INSERT INTO CATEGORIES (category) VALUES ($1)",
      [category]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error posting category:", err);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Update Product
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, description, stock } = req.body;
    const imageBuffer = req.file ? req.file.buffer : null; // If new image is uploaded
    const categoryQuery = await pool.query(
      "SELECT category_id FROM categories WHERE category = $1",
      [category]
    );
    const categoryId = categoryQuery.rows[0]?.category_id;

    const updateQuery = `
      UPDATE products
      SET product_name = $1, category = $2, price = $3, description = $4, quantity_in_stock = $5, category_id = $6, image = $7
      WHERE product_id = $8
      RETURNING *`;

    const updatedProduct = await pool.query(updateQuery, [
      name,
      category,
      price,
      description,
      stock,
      categoryId,
      imageBuffer,
      id,
    ]);

    res.json({
      message: "Product updated successfully",
      product: updatedProduct.rows[0],
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});

// Delete Product
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteQuery = "DELETE FROM products WHERE product_id = $1";
    await pool.query(deleteQuery, [id]);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

module.exports = router;
