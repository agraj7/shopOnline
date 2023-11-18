import React, { useEffect } from "react";
import { CgMouse } from "react-icons/cg";
import "./Home.css";
import ProductCard from "./ProductCard.js";
import MetaData from "../layout/MetaData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { useSelector, useDispatch } from "react-redux";
import Loader from "../layout/Loader/Loader";
// import {useAlert} from "react-alert"
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const product={
//   name:"Blue Tshirt",
//   images:[{url:"https://images.pexels.com/photos/17399227/pexels-photo-17399227/free-photo-of-young-man-in-a-blue-t-shirt-standing-on-a-grass-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"}],
//   price:"3000",
//   _id:"abhi",
// };

const Home = () => {
  const dispatch = useDispatch();
  const { loading, error, products } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct());
  }, [dispatch, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="maincontainer">
          <MetaData title="ShopOnline" />
          <div className="banner">
            <div>WELCOME TO SHOPONLINE</div>
            <h3 className="shop"> Find new products below</h3>
            <a href="#container">
              <button>
                Scroll
                <CgMouse />
              </button>
            </a>
          </div>
          <h2 className="homeHeading">Featured products</h2>
          <div className="container" id="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
