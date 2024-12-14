import React, { useEffect, useState } from "react";
import CartProducts from "./ShowCartProducts";
import { useCookies } from "react-cookie";
import "./design/Cart.scss";
import { useCart } from "./CartContext";

const Cart = () => {
  // const [cart, setCart] = useState([]);
  const { cart , Checkout} = useCart();
  // const {Checkout}=useCart();
  const [cookies] = useCookies(null);



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
