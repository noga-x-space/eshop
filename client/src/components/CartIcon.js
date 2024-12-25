import React, {  useState } from "react";
import Cart from "./Cart";
import { useCart } from "./CartContext";

const CartIcon = () => {
  const [isCartVisible, setIsCartVisible] = useState(false);
  const { cartCount } = useCart();

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible); // Toggle cart visibility
  };

  return (
    <button className="cart-icon" onClick={toggleCart}>
      <img src={"/shopping-cart.png"} className="cart-image" alt="image" />
      <span className="cart-count">{cartCount}</span>

      {isCartVisible && <Cart />}
    </button>
  );
};

export default CartIcon;
