import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from './component/layout/Footer/Footer'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import webFont from "webfontloader"
import React,{useState,useEffect} from "react"
import Home from "./component/Home/Home.js"
import ProductDetails from "./component/Product/ProductDetails.js"
import Products from "./component/Product/Products.js"
import Search from "./component/Product/Search.js"
import LoginSignUp from './component/User/LoginSignUp';
import store from "./store.js"
import {loadUser} from "./actions/userAction.js"
import UserOptions from "./component/layout/Header/UserOptions.js"
import { useSelector } from "react-redux";
import Profile from "./component/User/Profile.js"
import UpdateProfile from "./component/User/UpdateProfile.js"
import UpdatePassword from "./component/User/UpdatePassword.js"
import ForgotPassword from "./component/User/ForgotPassword.js"
import ResetPassword from "./component/User/ResetPassword.js"
import Cart from "./component/Cart/Cart.js"
import Shipping from "./component/Cart/Shipping.js"
import ConfirmOrder from "./component/Cart/ConfirmOrder.js"
import Payment from "./component/Cart/Payment.js"
import axios from "axios"
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from "./component/Cart/OrderSuccess.js"

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey,setStripeApiKey]= useState("");

  async function getStripeApiKey(){
    const {data}=await axios.get("api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
    console.log(data.stripeApiKey)
  }

    useEffect(()=>{
    webFont.load({
      google:{
        families:['Roboto',"Dravid Sans"]
      }
      })
      store.dispatch(loadUser())
      getStripeApiKey();
  },[])
  
  return (
        <BrowserRouter>
        <Header/>
        {isAuthenticated && <UserOptions user={user}/>}
        <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path = "/password/forgot" element ={<ForgotPassword/>}/>
        <Route path = "/password/reset/:token" element ={<ResetPassword/>}/>
        <Route path="/cart" element={<Cart/>}/>
        {isAuthenticated ? (
          <>
          <Route path="/account" element={<Profile />} />
          <Route path="/me/update" element={<UpdateProfile/>}/>
          <Route path = "/password/update" element ={<UpdatePassword/>}/>
          <Route path = "/shipping" element= {<Shipping/>}/>
          <Route path ="/order/confirm" element={<ConfirmOrder/>}/>
          {stripeApiKey && (
        <Route path="/process/payment" element={
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment />
          </Elements>
        } />
      )}
          <Route path="/success" element={<OrderSuccess/>}/>
          </>
        ) : (
          <Route path="/login" element={<LoginSignUp />} />
        )}
        <Route path="/login" element={<LoginSignUp/>} />
        </Routes>
        <Footer/>
        </BrowserRouter>
  );
}
export default App;