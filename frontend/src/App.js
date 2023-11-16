import './App.css';
import Header from "./component/layout/Header/Header.js"
import Footer from './component/layout/Footer/Footer'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import webFont from "webfontloader"
import React from "react"
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

function App() {

  const { isAuthenticated, user } = useSelector((state) => state.user);

  React.useEffect(()=>{
    webFont.load({
      google:{
        families:['Roboto',"Dravid Sans"]
      }
      })
      store.dispatch(loadUser())
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