// src/components/PurchasedProducts.js
import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, CardMedia } from "@mui/material";
import { useCookies } from "react-cookie";
import ProductImage from "./ProductImage";
import ProductRating from "./ProductRating";
import { useNavigate } from "react-router-dom";
import "./design/PurchasedProducts.scss";

const PurchasedProducts = () => {
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [cookies] = useCookies(null);
  const userName = cookies.UserName;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPurchasedProducts = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/purchases/${userName}`
      );
      const data = await response.json();
      // filtering the products so they'd be unique
      const seenNames = new Set();
      const uniqueProducts = [];

      data.forEach((product) => {
        if (!seenNames.has(product.product_name)) {
          uniqueProducts.push(product);
          seenNames.add(product.product_name);
        }
      });

      setPurchasedProducts(uniqueProducts);
    };

    fetchPurchasedProducts();
  }, []);

  return (
    <div className="purchased-products">
      {purchasedProducts.length > 0 ? (
        purchasedProducts.map((product) => (
          <div className="product-card" key={product.product_name}>
            <div
              className="image-container"
              onClick={() => {
                navigate("/details", { state: { product } });
              }}
            >
              <ProductImage productName={product.product_name} />
            </div>
            <div className="product-info">
              <h2>{product.product_name}</h2>
              <p className="product-category">{product.category}</p>
              <p className="product-description">{product.description}</p>
              <p className="product-price"> ${product.price}</p>
              {product.quantity_in_stock < 10 && (
                <p className="product-stock">
                  Only {product.quantity_in_stock} Left!
                </p>
              )}
              <ProductRating
                productName={product.product_name}
                userName={cookies.UserName}
                rateOption={true}
              />

            </div>
          </div>
          //   <Card key={product.product_name} sx={{ maxWidth: 345, margin: 2 }}>
          //     <CardMedia
          //       component="img"
          //       height="140"
          //       image={
          //         <ProductImage productName={product.product_name} /> ||
          //         "default_image_url.jpg"
          //       }
          //     />
          //     <CardContent>
          //       <Typography variant="h5" component="div">
          //         {product.product_name}
          //       </Typography>
          //       <Typography variant="body2" color="text.secondary">
          //         {product.description}
          //       </Typography>
          //       <Typography variant="body1" color="text.primary">
          //         Price: ${product.price}
          //       </Typography>
          //     </CardContent>
          //   </Card>
        ))
      ) : (
        <Typography>No purchased products found.</Typography>
      )}
    </div>
  );
};

export default PurchasedProducts;

