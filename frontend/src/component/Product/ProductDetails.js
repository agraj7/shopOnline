import React, { useEffect } from "react";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProductDetails } from "../../actions/productAction";
import ReactStars from "react-rating-stars-component"
import { useParams } from 'react-router-dom';
import Loader from "../layout/Loader/Loader";
import {toast} from "react-toastify"
import ReviewCard from "./ReviewCard"
import MetaData from "../layout/MetaData";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

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
  }, [dispatch, id,error,]);
  

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
                <button>-</button>
                <input value="1" type="number" />
                <button>+</button>
              </div>
              <button>Add to cart</button>
            </div>
            <p>
              Status : {""}
              <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                {product.stock < 1 ? "OutOfStock" : "InStock"}
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