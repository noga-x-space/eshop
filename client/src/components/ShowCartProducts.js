import React from "react";
import ProductImage from "./ProductImage";
import "./design/CartProducts.scss";
import { useCart } from "./CartContext";

const CartProducts = ({ products }) => {
  const { handleDelete } = useCart();

  return (
    <div className="cart-all-products">
      {products && products.length > 0 ? (
        products.map((product, index) => (
          <div className="cart-product-card" key={index}>
            <div className="cart-image-container">
              <ProductImage productName={product.product_name} />
            </div>
            <div className="cart-product-right-side">
              <div className="cart-product-details">
                <h4>{product.product_name}</h4>
                <p className="product-quantity"> {product.quantity}</p>
              </div>
              <div className="cart-product-price">${product.price}</div>

              <button className="trash-icon">
                <img
                  src={"/trash-bin.png"}
                  className="cart-image "
                  alt="image"
                  onClick={() => handleDelete(product.product_name)}
                />
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No products added</p>
      )}
    </div>
  );
};

export default CartProducts;
