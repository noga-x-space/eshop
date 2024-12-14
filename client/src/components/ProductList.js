import React, { useEffect, useState } from "react";
import Product from "./Product";
import CategoryBTN from "./CategoryBTN";
import SimilarProducts from "./SimilarProducts";

///improvements: limit top 5 buttons, add "show all"

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [categories, setCategories] = useState([]);

  const TITLE = "Products List:";

  const getProducts = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}:8000/products`);
      const resProducts = await response.json();
      
      setProducts(resProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}:8000/categories`);
      const resCategories = await response.json();
      setCategories(resCategories);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getProducts();
    getCategories();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    //i want to set the products to only the products from that category

    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/categories/${categoryId}`
      );
      const resProducts = await response.json();
      setProducts(resProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "name") {
      return a.product_name.localeCompare(b.product_name);
    } else if (sortOption === "price") {
      return parseFloat(a.price) - parseFloat(b.price);
    } else if (sortOption === "popularity") {
      return b.purchased_units - a.purchased_units;
    }
    return 0;
  });

  return (
    <div className="product-preview-1">
      <header className="header">
        <h1 className="title">{TITLE}</h1>
      </header>
      <div className="sort-header">
        <div className="sort-buttons">
          {categories.map((category, index) => (
            <button
              key={index}
              id={category.category_id}
              onClick={() => handleCategoryChange(category.category_id)}
            >
              {category.category}
            </button>
          ))}
        </div>
        <div>
          <label className="sort-label">Sort by:</label>
          <select
            className="sort-select"
            value={sortOption}
            onChange={handleSortChange}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
            <option value="popularity">Popularity</option>
          </select>
        </div>
      </div>

      <section className="product-preview">
        <Product products={sortedProducts} />
      </section>
    </div>
  );
};

export default ProductList;


