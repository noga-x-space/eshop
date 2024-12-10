// src/components/ProductRating.js
import React, { useState, useEffect } from "react";
import { Rating, Button, Typography } from "@mui/material";

const ProductRating = ({ productName, userName, rateOption = false }) => {
  const [value, setValue] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const [buyers, setBuyers] = useState(0); //the amount if buyers
  const [bought, setBought] = useState(false); //has the user bought this product

  // Fetch the average rating when the component mounts
  useEffect(() => {
    const fetchAverageRating = async () => {
      //the average
      const responseAVG = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/rate/${productName}/`
      );
      const dataAVG = await responseAVG.json();

      const avg = parseFloat(dataAVG.avg);
      setAvgRating(isNaN(avg) ? 0 : avg); // Set to 0 if avg is NaN

      // the amount of buyers
      const responseSUM = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/buyers/${productName}`
      );
      const dataSUM = await responseSUM.json();
      setBuyers(dataSUM.count, 0);
    };

    fetchAverageRating();
  }, [productName]);
  useEffect(() => {
    const fetchBought = async () => {
      try {
        const responseBought = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}:8000/purchases/${userName}`
        );
        const purchasedProducts = await responseBought.json(); // Store the result here
        const hasBought = purchasedProducts.some(
          (product) => product.product_name === productName
        );
        setBought(hasBought);
      } catch (error) {
        console.error("Error checking purchased products:", error);
      }
    };

    fetchBought();
    console.error("the avg rating is: ", avgRating);
  }, [userName, productName]);

  const handleRatingChange = async (newValue) => {
    setValue(newValue);

    // Send the rating to the server
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}:8000/rate/${userName}/${productName}/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: newValue }),
      }
    );

    if (response.ok) {
      alert("Rating submitted successfully!");
    } else {
      alert("Failed to submit rating.");
    }
  };

  return (
    <div>
      {!rateOption && (
        <>
          <Rating name="read-only" value={avgRating} precision={0.5} readOnly />
        </>
      )}
      {!rateOption && buyers}

      {rateOption && (
        <Rating
          name="product-rating"
          value={value}
          precision={0.5}
          onChange={(event, newValue) => handleRatingChange(newValue)}
        />
      )}
    </div>
  );
};

export default ProductRating;
