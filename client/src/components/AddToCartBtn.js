import { Button } from "bootstrap";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useCart } from "./CartContext";

function AddToCartBtn({ productName }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const userName = cookies.UserName;
  const { addToCart } = useCart();

  // const addToCart = async (productName) => {
  //   if (!userName) {
  //     console.error("User not logged in");
  //     return;
  //   }
  //   try {
  //     const response = await fetch(
  //       `${process.env.REACT_APP_BACKEND_URL}:8000/cart/${userName}/${productName}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           productName,
  //         }),
  //       }
  //     );

  //     if (response.ok) {
  //     } else {
  //       console.error("Failed to add product to cart");
  //     }
  //   } catch (err) {
  //     console.error("Error adding product to cart:", err);
  //   }
  // };

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
