import React, { useEffect, useState } from "react";
import "./design/ProductDetails.scss";
import { useLocation } from "react-router-dom";
import ProductImage from "./ProductImage";
import CartIcon from "./AddToCartBtn";
import SimilarProducts from "./SimilarProducts";
import ProductRating from "./ProductRating";
import { useCookies } from "react-cookie";

const ProductDetails = () => {
  const location = useLocation();
  const product = location.state?.product; // Check for existence of product data
  const [similarProducts, setSimilarProducts] = useState([]);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      if (product) {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}:8000/products?category=${product.category}`
          );
          const data = await response.json();
          setSimilarProducts(data);
        } catch (error) {
          console.error("Error fetching similar products:", error);
        }
      }
    };

    fetchSimilarProducts();
  }, [product]);

  return (
    // <div>
    //   <div className="blobs">
    //     <img
    //       className="top-left-img"
    //       crossOrigin="anonymous"
    //       src="https://media-public.canva.com/oJYkw/MAFmhAoJYkw/1/s.png"
    //       draggable="false"
    //       alt="Corner brown aesthetic curve"
    //     />
    //     <img
    //       className="bottom-left-img"
    //       crossOrigin="anonymous"
    //       src="https://media-public.canva.com/eKGsc/MAFp4KeKGsc/1/s.png"
    //       draggable="false"
    //       alt="Corner brown aesthetic curve"
    //     />
    //     <img
    //       class="bottom-right-img"
    //       crossorigin="anonymous"
    //       src="https://media-public.canva.com/Z0JEA/MAFp4JZ0JEA/1/s.png"
    //       draggable="false"
    //     ></img>
    //   </div>
    //   <div className="content">
    //     <div className="main-product-image" styles={{ maxWidth: "10px" }}>
    //       <ProductImage productName={product.product_name} />
    //     </div>
    //     <div className="container-right-side">
    //       <div className="product-details">
    //         <h1>{product.product_name}</h1>
    //         <p className="product-category">{product.category}</p>
    //         <p className="product-description">{product.description}</p>
    //         <p className="product-price"> ${product.price}</p>
    //         {product.quantity_in_stock < 10 && (
    //           <p className="product-stock">
    //             Only {product.quantity_in_stock} Left!
    //           </p>
    //         )}

    //         {/* ratings */}
    //         <ProductRating
    //           productName={product.product_name}
    //           userName={cookies.UserName}
    //         />

    //         <CartIcon productName={product.product_name} />
    //       </div>

    //       <SimilarProducts className="suggestions" products={similarProducts} />
    //     </div>

    //   </div>
    // </div>

    <div className="product-details-container">
      <div className="blobs">
        <img
          className="top-left-img"
          crossOrigin="anonymous"
          src="https://media-public.canva.com/oJYkw/MAFmhAoJYkw/1/s.png"
          draggable="false"
          alt="Corner brown aesthetic curve"
        />
        <img
          className="bottom-left-img"
          crossOrigin="anonymous"
          src="https://media-public.canva.com/eKGsc/MAFp4KeKGsc/1/s.png"
          draggable="false"
          alt="Corner brown aesthetic curve"
        />
        <img
          className="bottom-right-img"
          crossOrigin="anonymous"
          src="https://media-public.canva.com/Z0JEA/MAFp4JZ0JEA/1/s.png"
          draggable="false"
          alt="Corner brown aesthetic curve"
        />
      </div>
      <div className="content">
        <div className="main-product-image" styles={{ maxWidth: "10px" }}>
          <ProductImage productName={product.product_name} />
        </div>
        <div className="container-right-side">
          <div className="product-details">
            <h1>{product.product_name}</h1>
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
            />
            <CartIcon productName={product.product_name} />
          </div>
          <SimilarProducts className="suggestions" products={similarProducts} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
