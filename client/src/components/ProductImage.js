import React, { useEffect, useState } from "react";

const ProductImage = ({ productName }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    fetch(`http://localhost:8000/products/${productName}/image`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch image");
        }
        return response.blob();
      })
      .then((blob) => {
        console.log("Blob received:", blob); // Check the blob in the console
        const url = URL.createObjectURL(blob);
        setImageSrc(url);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
      });
  }, [productName]);

  return (
    <>
      {imageSrc ? (
        <div className="product-main-image">
          {" "}
          <img src={imageSrc} alt="Product" />
        </div>
      ) : (
        <p>No image available</p>
      )}
    </>
  );
};

export default ProductImage;
