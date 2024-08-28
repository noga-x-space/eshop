import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import Homepage from "./components/Homepage";
import Auth from "./components/Auth";
import NavBar from "./components/Navbar";
import Product from "./components/Product";
import ProductList from "./components/ProductList";
import YetProductsList from "./components/YetProductsList";
import Cart from "./components/Cart";
//import Header from "./components/Header";

const TITLE = "Noga's Shop";

function App() {
  return (
    <Router>
      <div className="App">
        <Helmet>
          <title> {TITLE} </title>
        </Helmet>

        <NavBar />

        <Switch>
          {/* <Route exact path="/NavBar">
            <NavBar /> */}
          {/* </Route> */}
        </Switch>

        <Switch>
          <Route exact path="/">
            <Homepage />
          </Route>
        </Switch>

        <switch>
          <Route exact path="/cart">
            <Cart />
          </Route>
        </switch>
        <Switch>
          <Route exact path="/shop">
            <ProductList />
          </Route>
        </Switch>

        <Switch>
          <Route exact path="/signup">
            <Auth />
          </Route>
        </Switch>

        <footer />
      </div>
    </Router>
  );
}

export default App;
