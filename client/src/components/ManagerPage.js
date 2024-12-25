import React, { useState, useEffect } from "react";
// import "./design/ManagerPage.scss";
import "./design/MP2.scss";
import ProductImage from "./ProductImage";
import { useCookies } from "react-cookie";

const ManagerPage = () => {
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    stock: "",
    image: null,
  });

  const [cookies] = useCookies(null);
  const userName = cookies.UserName;

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}:8000/manage/`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}:8000/categories`
        );
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch all products (on component mount)
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/products`
      );
      const data = await response.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  if (!userName) {
    return (
      <div>
        <h1>Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // Handle Product Form Input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Image Upload
  const handleImageUpload = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  // Submit New Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      formData.append(key, value);
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/manage/`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Product added successfully!");
        setNewProduct({
          name: "",
          category: "",
          price: "",
          description: "",
          stock: "",
          image: null,
        });
      } else {
        alert("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle Edit Product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    // Populate fields to edit (you can create a modal or another section for this)
  };

  // Handle Delete Product
  const handleDeleteProduct = async (productId) => {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}:8000/manage/${productId}`,
      { method: "DELETE" }
    );
    if (response.ok) {
      setProducts((prev) =>
        prev.filter((product) => product.product_id !== productId)
      );
    }
  };

  // Handle Next/Prev for scrolling
  const handlePrevPage = () => {
    // Update the current page state to show previous set of products
  };

  const handleNextPage = () => {
    // Update the current page state to show next set of products
  };

  return (
    <div className="manager-page">
      <h1>Manager Page</h1>
      <div>
        <div className="manager-layout">
          {/* Add Product Section */}
          <section className="add-product">
            <h2>Add New Product</h2>
            <form onSubmit={handleAddProduct} className="add-product-form">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={handleInputChange}
                required
              />
              <select
                name="category"
                value={newProduct.category}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.category_id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="price"
                placeholder="Price"
                value={newProduct.price}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Description"
                value={newProduct.description}
                onChange={handleInputChange}
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={newProduct.stock}
                onChange={handleInputChange}
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              <button type="submit" className="btn-primary">
                Add Product
              </button>
            </form>
          </section>

          {/* Edit/Delete Product Section */}
          <section className="edit-products">
            <h2>Edit Existing Products</h2>
            <div className="product-scroll">
              {/* Dynamically Render Product Cards */}
              {products.map((product) => (
                <div className="product-card" key={product.product_id}>
                  {/* Product Image */}
                  <ProductImage productName={product.product_name} />

                  {/* Product Info */}
                  <h3>{product.product_name}</h3>
                  <p>{product.category}</p>
                  <p>${product.price}</p>

                  {/* Edit and Delete Buttons */}
                  <button onClick={() => handleEditProduct(product)}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.product_id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="scroll-controls">
              <button onClick={handlePrevPage}>←</button>
              <button onClick={handleNextPage}>→</button>
            </div>
          </section>
        </div>

        {/* Users Section */}
        <section className="view-users">
          <h2>All Users</h2>
          {users.length > 0 ? (
            <table className="users-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.user_name}</td>
                    <td>{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ManagerPage;
