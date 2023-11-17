import React, { useEffect, useState} from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import ReactStars from "react-rating-stars-component"
import { useParams } from 'react-router-dom';
import Loader from "../layout/Loader/Loader";
import {toast} from "react-toastify"
import ReviewCard from "./ReviewCard"
import MetaData from "../layout/MetaData"
import {addItemsToCart} from "../../actions/cartAction"

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  const [quantity, setQuantity] = useState(1);
  const increaseQuantity = () =>{
    if(product.Stock <=quantity) return;
    const qty = quantity + 1;
    setQuantity(qty);
  }
  const decreaseQuantity = () =>{
    if (quantity <=1) return;
    const qty = quantity - 1;
    setQuantity(qty);
  }

  const addToCartHandler = () =>{
    dispatch(addItemsToCart(id,quantity));
    toast.success("Item added to cart");
  }

  useEffect(() => {
    if(error)
    {
        toast.error(error, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        });
        dispatch(clearErrors())
    }
    if (id) {
      dispatch(getProductDetails(id));
    }
  }, [dispatch, id,error]);
  

  const options = {
    size: 20,
    value: product.ratings,
    readOnly: true,
    precision: 0.5,
  };

  return (
    <div>
          {loading ? (
        <Loader />
      ) : (
        <div>
          <MetaData title={`${product.name} - shopOnline`} />
      <div className="ProductDetails">
        <div className="leftContainer">
          {product.images &&
            product.images.map((item, i) => (
              <img
                className="CarousalImage"
                key={item.url}
                src={item.url}
                height={500}
                alt={`${i} Slide`}
              />
            ))}
        </div>
        <div className="rightcontainer">
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
            <p>Product #{product._id}</p>
          </div>
          <div className="detailsBlock-2">
            <ReactStars {...options} />
            <span>({product.numOfReviews} Reviews)</span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹ ${product.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button onClick={decreaseQuantity}>-</button>
                <input readOnly type="number" value={quantity} />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button disabled={product.Stock<1} onClick={addToCartHandler}>Add to cart</button>
            </div>
            <p>
              Status : {""}
              <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                {product.Stock < 1 ? "OutOfStock" : "InStock"}
              </b>
            </p>
          </div>
          <div className="detailsBlock-4">
            Description:<p>{product.description}</p>
          </div>
          <button className="submitReview">Submit Review</button>
        </div>
      </div>
      <h3 className="reviewsHeading">REVIEWS</h3>
      {product.reviews && product.reviews[0] ? (
            <div className="reviews">
              {product.reviews &&
                product.reviews.map((review) => (
                  <ReviewCard key={review._id} review={review} />
                ))}
            </div>
          ) : (
            <p className="noReviews">No Reviews Yet</p>
          )}
      </div>
      )}
    </div>
  );
};

export default ProductDetails;