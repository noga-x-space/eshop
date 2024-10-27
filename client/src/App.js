import React from "react";
// import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Auth from "./components/Auth";
import NavBar from "./components/Navbar";
import Product from "./components/Product";
import ProductList from "./components/ProductList";
import YetProductsList from "./components/YetProductsList";
import Cart from "./components/Cart";
import ProductDetails from "./components/ProductDetails";
import Testing from "./components/Testing";

const TITLE = "Noga's Shop";

function App() {
  return (
    <Router>
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
          <Route path="/t" element={<Testing />} />
          <Route path="/signup" element={<Auth />} />
        </Routes>

        <footer />
      </div>
    </Router>
  );
}

export default App;
