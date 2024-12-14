import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import PurchasedProducts from "./PurchasedProducts";
import "./design/HomePage.scss";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const [users, setUsers] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [purchases, setPurchases] = useState(null);

  const navigate = useNavigate();

  const getUsers = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}:8000/getusers`
      );
      const resUsers = await response.json();
      setUsers(resUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const getPrevPurchases = async () => {
    if (cookies.UserName) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}:8000/${cookies.UserName}/`
        );
        const data = await response.json();
        setPurchases(data.average_rating || 0);
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    getUsers();
    getPrevPurchases();
  }, [cookies.UserName]);

  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Welcome to Our Lip Gloss Collection</h1>
        <p>
          Explore our range of beautiful lip glosses for every mood and style.
        </p>
      </header>

      {cookies.UserName && (
        <div className="user-info">
          <h2>Welcome, {cookies.UserName}</h2>
          <p>
            Your average rating for previous purchases: {purchases || "N/A"}
          </p>
        </div>
      )}

      <section className="purchased-products-section">
        <h2>My Purchased Products</h2>
        <PurchasedProducts />
      </section>

      <section className="explore-products">
        <h2>Explore Our Collection</h2>
        <p>
          Browse through our curated collections to find your perfect lip gloss.
        </p>
        <button
          className="cta-button"
          onClick={() => {
            navigate("/shop");
          }}
        >
          Browse All Products
        </button>
      </section>

      <footer className="homepage-footer">
        <p>&copy; 2024 Lip Gloss Collection. All rights reserved.</p>
        <p>Follow us on social media for the latest updates!</p>
      </footer>
    </div>
  );
}
