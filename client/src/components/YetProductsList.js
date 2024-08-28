import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";

const YetProductsList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  //   const [selectedCat, setSelectedCat] = useState([products]);

  const getProducts = async () => {
    try {
      const response = await fetch("http://localhost:8000/products");
      const resProducts = await response.json();
      console.log("Fetched products:", resProducts);
      setProducts(resProducts);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategories = async () => {
    try {
      const response = await fetch("http://localhost:8000/categories");
      const resCategories = await response.json();
      //   console.log("categories:", resCategories);
      setCategories(resCategories);
      console.log("THESE ARE THE CATEGORIES: ", categories);
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
        `http://localhost:8000/categories/${categoryId}`
      );
      const resProducts = await response.json();
      setProducts(resProducts);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
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
      <ProductList products={products} />
    </div>
  );
};

export default YetProductsList;
