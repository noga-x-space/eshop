import React from "react";
import ProductImage from "./ProductImage";
import CartIcon from "./AddToCartBtn";
import "./design/Product.scss";
import { useState } from "react";
import ProductDetails from "./ProductDetails";
import { useNavigate } from "react-router-dom";
import ProductRating from "./ProductRating";

const Product = ({ products }) => {
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const navigate = useNavigate();

  // const handleProductClick = (product) => {
  //   setSelectedProduct(product);
  // };

  return (
    <div className="product-page">
      <div className="product-grid">
        {products && products.length > 0 ? (
          products.map((product, index) => (
            <div
              className="product-card"
              key={index}
              // onClick={() => handleProductClick(product)}
            >
              <div
                className="image-container"
                onClick={() => {
                  navigate("/details", { state: { product } });
                }}
              >
                <ProductImage productName={product.product_name} />
              </div>
              <h2>{product.product_name}</h2>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-price"> ${product.price}</p>
              {product.quantity_in_stock < 10 && (
                <p className="product-stock">
                  Only {product.quantity_in_stock} Left!
                </p>
              )}
              <ProductRating
                productName={product.product_name}
              />

              <CartIcon productName={product.product_name} />
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
};

export default Product;
