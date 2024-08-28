import React, { useEffect, useState } from "react";

const CategoryBTN = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts]=useState([])

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
    getCategories();
  }, []);

  return (
    <div className="sort-buttons">
      {categories.map((category, index) => (
        <button key={index} id={category.category_id}>
          {category.category}
        </button>
      ))}
    </div>
  );
};

export default CategoryBTN;
