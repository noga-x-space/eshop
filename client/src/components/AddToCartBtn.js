import { Button } from "bootstrap";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function AddToCartBtn({ productName }) {
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const userName = cookies.UserName;

  // const handleCartClick = () => {
  //   setItemCount((prevCount) => prevCount + 1);
  // };

  const addToCart = async (productName) => {
    if (!userName) {
      console.error("User not logged in");
      // alert("User not logged in");
      return;
    }
    // alert("User  logged in");
    try {
      const response = await fetch(
        `http://localhost:8000/cart/${userName}/${productName}`,
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
        console.log("Product added to cart");
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (err) {
      console.error("Error adding product to cart:", err);
    }
  };

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
