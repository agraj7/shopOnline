import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import logo from "../../../images/logo.png";
import "./Header.css";
import { toast } from "react-toastify";

const Header = () => {


  return (
    <div className="navBar">
      <Link to="/" className="home" id="logoImage"><img src={logo} height="80px" alt="logoImage" /></Link>
      <Link to="/" className="home"><h2>ShopOnline</h2></Link>
      <Link to="/" className="home">Home</Link> 
      <Link to="/products" className="products">Products</Link> 
      <Link to="/contact" className="contact">Contact</Link> 
      <Link to="/search" className="search">Search</Link>
      <Link to="/cart" className="cart">Cart</Link>
      <Link to="/login"className="login">Login</Link>
    </div>
  );
}

export default Header;
