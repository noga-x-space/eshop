import React from "react";
import "./design/ProductDetails.scss";

//for now- product is only a name
const ProductDetails = () => {
  return (
    <div className="product-details-container">
      {/* Leftmost Blue Rectangle: Product Image */}
      <div className="product-image">
        {/* <img src={product.imageUrl} alt={product.name} /> */}
      </div>

      {/* Top Red Rectangle: Product Name */}
      <div className="product-name">
        {/* <h2>{product.name}</h2> */}
      </div>

      {/* Middle Brown Rectangle: Product Description */}
      <div className="product-description">
        {/* <p>{product.description}</p> */}
      </div>

      {/* Bottom Green Rectangle: Placeholder for Purchase, Ratings, etc. */}
      <div className="product-extra">
        {/* Placeholder content */}
        {/* <button className="buy-button">Buy Now</button> */}
      </div>

      {/* Absolute Positioned Brown Blobs */}
      <div className="blob blob1"></div>
      <div className="blob blob2"></div>
    </div>
  );
};

export default ProductDetails;
