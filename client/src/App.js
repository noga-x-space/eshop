import React from "react";
// import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import { useEffect } from "react";
import Auth from "./components/Auth";
import NavBar from "./components/Navbar";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import ManagerPage from "./components/ManagerPage";
import { CartProvider } from "./components/CartContext";

const TITLE = "Noga's Shop";

function App() {
  useEffect(() => {
    // Dynamically set the viewport meta tag
    const metaTag = document.createElement("meta");
    metaTag.name = "viewport";
    metaTag.content = "width=device-width, initial-scale=1.0";
    document.head.appendChild(metaTag);
  }, []);
  return (
    <Router>
      <CartProvider>
        <div className="App">
          {/* <Helmet> */}
          <title> {TITLE} </title>
          {/* </Helmet> */}
          <NavBar />

          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/shop" element={<ProductList />} />
            <Route path="/details" element={<ProductDetails />} />
            <Route path="/signup" element={<Auth />} />
            <Route path="/manage" element={<ManagerPage />} />
          </Routes>

          <footer />
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;
