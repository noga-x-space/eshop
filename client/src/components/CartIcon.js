import React, { useEffect, useState } from "react";
import CartProducts from "./ShowCartProducts";
import { useCookies } from "react-cookie";
import Cart from "./Cart";

const CartIcon = () => {
  const [cart, setCart] = useState(0);
  const [cookies] = useCookies(null);
  const [isCartVisible, setIsCartVisible] = useState(false);

  const userName = cookies.UserName;

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible); // Toggle cart visibility
  };

  const countCart = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/cartitems/${userName}`
      );
      const resCart = await response.json();
      setCart(resCart);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    countCart();
  }, []);

  return (
    // <section className="cart-preview">
    <button className="cart-icon" onClick={toggleCart} >
      <img src={"/shopping-cart.png"} className="cart-image" alt="image" />
      <span className="cart-count">{cart}</span>

      {isCartVisible && <Cart />}
    </button>
  );
};

export default CartIcon;
