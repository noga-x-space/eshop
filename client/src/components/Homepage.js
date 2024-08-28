import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import Product from "./Product";

export default function Homepage() {
  const [users, setUsers] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(null);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:8000/getusers");
      const resUsers = await response.json();
      console.log("Fetched users:", resUsers); // Log the actual response
      setUsers(resUsers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getUsers();
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
    </div>
  );
}

//rfc / rafce
