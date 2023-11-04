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


function App() {
  React.useEffect(()=>{
    webFont.load({
      google:{
        families:['Roboto',"Dravid Sans"]
      }
      })
  },[])
  
  return (
        <BrowserRouter>
        <Header/>
        <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:keyword" element={<Products />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<LoginSignUp/>} />
        </Routes>
        <Footer/>
        </BrowserRouter>
  );
}
export default App;