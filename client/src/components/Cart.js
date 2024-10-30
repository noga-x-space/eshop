import React, { useEffect, useState } from "react";
import CartProducts from "./ShowCartProducts";
import { useCookies } from "react-cookie";
import "./design/Cart.scss";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [cookies] = useCookies(null);
  // const [isCartEmpty, setIsCartEmpty] = useState(true); // State to track if the cart is empty

  const userName = cookies.UserName;

  const getCartData = async () => {
    try {
      const response = await fetch(`http://localhost:8000/cart/${userName}`);
      const resCart = await response.json();
      setCart(resCart);
    } catch (err) {
      console.error(err);
    }
  };

  const Checkout = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/checkout/${userName}`
      );
      const resCart = await response.json();
      setCart(resCart);
      // setIsCartEmpty(resCart.length === 0);

      window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getCartData();
  }, []);

  const isCartEmpty = cart.length === 0;

  return (
    <section className="cart-preview">
      <header className="cart-header">
        <h1>Your Cart</h1>
      </header>
      <div className="cart-items">
        <CartProducts products={cart} />
      </div>
      {!isCartEmpty && (
        <button className="button-1" onClick={() => Checkout()}>
          Checkout
        </button>
      )}
    </section>
  );
};

export default Cart;
