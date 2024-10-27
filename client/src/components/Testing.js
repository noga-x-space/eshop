import React, { useEffect, useState } from "react";
// import "./testing.scss"; // Import the stylesheet
import "./design/testing.scss";
import { useLocation } from "react-router-dom";
import ProductImage from "./ProductImage";
import CartIcon from "./AddToCartBtn";

const Testing = () => {
  const location = useLocation();
  const product = location.state?.product; // Check for existence of product data
  const [similarProducts, setSimilarProducts] = useState([]);

  ///// for my personal use- current list of product.properties

  useEffect(() => {
    console.log("the product is: ", product);
  }, []);

  return (
    <div>
      <div className="blobs">
        <img
          className="top-left-img"
          crossOrigin="anonymous"
          src="https://media-public.canva.com/oJYkw/MAFmhAoJYkw/1/s.png"
          draggable="false"
          alt="Corner brown aesthetic curve"
        />
        <img
          className="bottom-left-img"
          crossOrigin="anonymous"
          src="https://media-public.canva.com/eKGsc/MAFp4KeKGsc/1/s.png"
          draggable="false"
          alt="Corner brown aesthetic curve"
        />
        <img
          class="bottom-right-img"
          crossorigin="anonymous"
          src="https://media-public.canva.com/Z0JEA/MAFp4JZ0JEA/1/s.png"
          draggable="false"
        ></img>
      </div>
      <div className="content">
        <div className="main-product-image" styles={{ maxWidth: "10px" }}>
          <ProductImage productName={product.product_name} />
        </div>
        <div className="product-details">
          <h1>{product.product_name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-description">{product.description}</p>
          <p className="product-price"> ${product.price}</p>
          {product.quantity_in_stock < 10 && (
            <p className="product-stock">
              Only {product.quantity_in_stock} Left!
            </p>
          )}

          <CartIcon productName={product.product_name} />
        </div>
      </div>
      <div className="absolute-div">{/* ... other elements ... */}</div>
    </div>
  );
};

export default Testing;
