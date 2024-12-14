import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { NavLink } from "react-router-dom";
import CartIcon from "./CartIcon";
import "./design/NavBar.scss";

function NavBar() {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const isLoggedIn = cookies.UserName ? true : false;
  const name = isLoggedIn ? cookies.UserName : "starnger";

  const TITLE = "Noga's Shop";
  const handleSignOut = () => {
    removeCookie("UserName");
    removeCookie("AuthToken");

    window.location.reload();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light flex-column text-center">
      <div className="container-fluid">
        <h1 className="navbar-brand mx-auto">{TITLE}</h1>
        <div className="cart">
          <CartIcon />
        </div>
      </div>
      <div className="navbar-collapse">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <NavLink className="nav-link" to="/">
              Homepage
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink className="nav-link" to="/shop">
              Our Collection
            </NavLink>
          </li>
          {!cookies.UserName && (
            <li className="nav-item">
              <NavLink className="nav-link" to="/signup">
                Log In
              </NavLink>
            </li>
          )}
          {cookies.UserName && (
            <li className="nav-item">
              <button
                className="btn btn-outline-danger"
                onClick={handleSignOut}
              >
                Log Out
              </button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
