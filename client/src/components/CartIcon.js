import React, { useEffect, useState } from "react";
import CartProducts from "./ShowCartProducts";
import { useCookies } from "react-cookie";
import Cart from "./Cart";
import { useCart } from "./CartContext";

const CartIcon = () => {
  // const [cartCount, setCartCount] = useState(0);
  const [cookies] = useCookies(null);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const {cartCount} = useCart();

  // const userName = cookies.UserName;

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible); // Toggle cart visibility
  };

//how many cart items?
  // const countCart = async () => {
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BACKEND_URL}:8000/cartitems/${userName}`
  //     );
  //     const resCart = await response.json();
  //     setCartCount(resCart);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };


  return (
    <button className="cart-icon" onClick={toggleCart} >
      <img src={"/shopping-cart.png"} className="cart-image" alt="image" />
      <span className="cart-count">{cartCount}</span>

      {isCartVisible && <Cart />}
    </button>
  );
};

export default CartIcon;
