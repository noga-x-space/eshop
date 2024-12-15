import React from "react";
import { useCookies } from "react-cookie";
import { useCart } from "./CartContext";

function AddToCartBtn({ productName }) {
  const { addToCart } = useCart();

  return (
    <div className="shopping-cart">
      <button
        type="button"
        class=" add-to-cart button-1"
        onClick={() => addToCart(productName)}
      >
        Add Me!
      </button>
    </div>
  );
}
export default AddToCartBtn;
