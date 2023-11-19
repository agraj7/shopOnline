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
import axiosInstance from './Helpers/axiosInstance.js';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import OrderSuccess from "./component/Cart/OrderSuccess.js"
import MyOrders from "./component/Order/MyOrders.js"
import OrderDetails from "./component/Order/OrderDetails.js"
import Dashboard from "./component/Admin/Dashboard.js"
import ProductList from "./component/Admin/ProductList.js"
import NewProduct from './component/Admin/NewProduct.js';
import UpdateProduct from "./component/Admin/UpdateProduct.js"
import OrderList from "./component/Admin/OrderList.js"
import ProcessOrder from "./component/Admin/ProcessOrder.js" 
import UsersList from "./component/Admin/UsersList.js"
import UpdateUser from "./component/Admin/UpdateUser.js"
import ProductReviews from "./component/Admin/ProductReviews.js"
import NotFound from "./component/layout/NotFound/NotFound";

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);
  const [stripeApiKey,setStripeApiKey]= useState("");


  async function getStripeApiKey(){
    const {data}=await axiosInstance.get("api/v1/stripeapikey");
    setStripeApiKey(data.stripeApiKey);
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
          <Route exact path ="/order/confirm" element={<ConfirmOrder/>}/>
          {stripeApiKey && (
        <Route path="/process/payment" element={
          <Elements stripe={loadStripe(stripeApiKey)}>
            <Payment />
          </Elements>
        } />
      )}
          <Route path="/success" element={<OrderSuccess/>}/>
          <Route path ="/orders" element = {<MyOrders/>}/>
          <Route path="/order/:id" element ={<OrderDetails/>}/>
          <Route path="/admin/dashboard" element ={<Dashboard/>}/>
          <Route path ="/admin/products" element = {<ProductList/>}/>
          <Route path ="/admin/product" element ={<NewProduct/>}/>
          <Route path ="/admin/product/:id" element ={<UpdateProduct/>}/>
          <Route path = "/admin/orders" element={<OrderList/>}/>
          <Route path = "/admin/order/:id" element={<ProcessOrder/>}/>
          <Route path = "/admin/users" element={<UsersList/>}/>
          <Route path ="/admin/user/:id" element ={<UpdateUser/>}/>
          <Route path = "/admin/reviews" element={<ProductReviews/>}/>
          </>
        ) : (
          <Route path="/login" element={<LoginSignUp />} />
        )}
        <Route path="/login" element={<LoginSignUp/>} />



        {!isAuthenticated && (
          <>
          <Route path="/account" element={<NotFound/>} />
          <Route path="/me/update" element={<NotFound/>}/>
          <Route path = "/password/update" element ={<NotFound/>}/>
          <Route path = "/shipping" element= {<NotFound/>}/>
          <Route exact path ="/order/confirm" element={<NotFound/>}/>
          <Route path="/process/payment" element={<NotFound/>}/>
          <Route path="/success" element={<NotFound/>}/>
          <Route path ="/orders" element = {<NotFound/>}/>
          <Route path="/order/:id" element ={<NotFound/>}/>
          <Route path="/admin/dashboard" element ={<NotFound/>}/>
          <Route path ="/admin/products" element = {<NotFound/>}/>
          <Route path ="/admin/product" element ={<NotFound/>}/>
          <Route path ="/admin/product/:id" element ={<NotFound/>}/>
          <Route path = "/admin/orders" element={<NotFound/>}/>
          <Route path = "/admin/order/:id" element={<NotFound/>}/>
          <Route path = "/admin/users" element={<NotFound/>}/>
          <Route path ="/admin/user/:id" element ={<NotFound/>}/>
          <Route path = "/admin/reviews" element={<NotFound/>}/>
          </>
        )}
        <Route path ="*" element={<NotFound/> }/>
        </Routes>
        <Footer/>
        </BrowserRouter>
  );
  
}
export default App;