import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import PurchasedProducts from "./PurchasedProducts";

export default function Homepage() {
  const [users, setUsers] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [purchases, setPurchases] = useState(null);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/getusers");
      const resUsers = await response.json();
      setUsers(resUsers);
    } catch (err) {
      console.error(err);
    }
  };

  const getPrevPurchases = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/${cookies.UserName}/`
      );
      const data = await response.json();
      setPurchases(data.average_rating || 0);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUsers();
    getPrevPurchases();
  }, []);

  return (
    <div>
      <header className="homepage-header">
        <h1>Welcome to Our Lip Gloss Collection</h1>
        <p>
          Explore our range of beautiful lip glosses for every mood and style.
        </p>
      </header>
      {users && users.length > 0 ? (
        <div>
          <h2>currently logged as: {cookies.UserName}</h2>
          <h1>Users List:</h1>
          <ul>
            {users.map((user, index) => (
              <li key={index}>{user.user_name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No users found</p>
      )}
      {purchases && (
        <div className="purchases">
          {purchases.map((prod, index) => {
            <li key={index}>{prod.product_name}</li>;
          })}
        </div>
      )}
      <div>
        <h1>My Purchased Products</h1>
        <PurchasedProducts />
      </div>
    </div>
  );
}

//rfc / rafce
