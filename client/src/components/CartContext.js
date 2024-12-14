import { Children, createContext, React, useContext, useEffect } from "react";
import { useState } from "react";
import { useCookies } from "react-cookie";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cookies] = useCookies(null);

  const userName = cookies.UserName;

  const addToCart = async (productName) => {
    if (!userName) {
      console.error("User not logged in");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/cart/${userName}/${productName}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName,
          }),
        }
      );

      if (response.ok) {
        // const updatedCart = await response.json();
        // setCart(updatedCart);
        // console.log("this is the response from updating: ", updatedCart);
        await getCartData();
        await countCart();
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };

  const handleDelete = async (productName) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/delete/${userName}/${productName}`
      );
      if (response.ok) {
        // const updatedCart = await response.json();
        // setCart(updatedCart);
        await getCartData();
        await countCart();
      } else {
        console.error("Failed to remove product from cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const Checkout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/checkout/${userName}`
      );
      const resCart = await response.json();
      setCart(resCart);
      // setIsCartEmpty(resCart.length === 0);

      window.location.reload(false);
    } catch (err) {
      console.error(err);
    }
  };
  const getCartData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/cart/${userName}`
      );
      const resCart = await response.json();
      setCart(resCart);
    } catch (err) {
      console.error(err);
    }
  };

  const countCart = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/cartitems/${userName}`
      );
      const resCartCount = await response.json();
      setCartCount(resCartCount);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    countCart();
    getCartData();
  }, []);

  return (
    <div>
      <CartContext.Provider
        value={{ cart, cartCount, addToCart, Checkout, handleDelete }}
      >
        {children}
      </CartContext.Provider>
    </div>
  );
};
