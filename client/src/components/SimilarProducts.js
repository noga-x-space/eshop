import React from "react";
import ProductImage from "./ProductImage";
import { useNavigate } from "react-router-dom";
import "./design/SimilarProducts.scss";
import ProductRating from "./ProductRating";

const SimilarProducts = ({ products }) => {
  const navigate = useNavigate();

  const handleProductClick = (product) => {
    navigate("/details", { state: { product } });
  };

  return (
    <div className="similar-products">
      <h2>Similar Products</h2>

      <div className="product-grid">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div
              className="product-card"
              key={index}
              onClick={() => handleProductClick(product)}
            >
              <div className="image-container">
                <ProductImage productName={product.product_name} />
              </div>
              <h3>{product.product_name}</h3>
              <ProductRating
                productName={product.product_name}
              />
              <p className="product-price"> ${product.price}</p>
            </div>
          ))
        ) : (
          <p>No similar products found</p>
        )}
      </div>
    </div>
  );
};

export default SimilarProducts;
