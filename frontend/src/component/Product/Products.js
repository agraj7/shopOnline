import React, { useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loader from "../layout/Loader/Loader";
import ProductCard from "../Home/ProductCard";
import { useParams } from "react-router-dom";
import Pagination from "react-js-pagination";
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

const categories = [
  "Laptop",
  "Footwear",
  "Bottom",
  "Tops",
  "Attire",
  "Camera",
  "Smartphones",
  "Accessories",
  "Adventure",
  "Miscellenous",
]

const Products = () => {
  const { keyword } = useParams();
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0,30000]);
  const [category,setCategory] = useState("");
  const [ratings,setRatings] = useState(0);

  const { products, loading, error, productCount, resultPerPage } = useSelector(
    (state) => state.products
  );

  const setCurrentPageNo = (e) => {
    setCurrentPage(e);
  };

  const priceHandler = (event,newPrice) =>{
    setPrice(newPrice);
  }

  useEffect(() => {
    dispatch(getProduct(keyword, currentPage,price,category,ratings));
  }, [dispatch, keyword, currentPage,price,category,ratings]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div>
          <h2 className="productsHeading">Products</h2>
          <div className="products">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>

          <div className="filterBox">
          <div>
            <Typography>Price</Typography>
            <Slider
              value={price}
              onChange={priceHandler}
              valueLabelDisplay="auto"
              aria-labelledby="range-slider"
              min={0}
              max={30000}
            />
            </div>
            <div>
            <Typography>Categories</Typography>
            <ul className="categoryBox">
              {categories.map((category)=>(
                <li 
                className="category-link"
                key={category}
                onClick={()=>setCategory(category)}>{category}</li>
              ))}
            </ul>
            </div>
            <div>
            <fieldset>
              <Typography component="legend">Ratings Above</Typography>
              <Slider 
              value={ratings}
              onChange={(e,newRatings)=>{
              setRatings(newRatings);

              }}
              aria-lebellledby="continuous-slider"
              min={0}
              max={5}
              valueLabelDisplay="auto"
              />
            </fieldset>
            </div>
          </div>

          {resultPerPage < productCount && (
            <div className="paginationBox">
              <Pagination
                activePage={currentPage}
                itemsCountPerPage={resultPerPage}
                totalItemsCount={productCount}
                onChange={setCurrentPageNo}
                nextPageText="Next"
                prevPageText="Prev"
                firstPageText="First"
                lastPageText="Last"
                itemClass="page-item"
                linkClass="page-link"
                activeClass="pageItemActive"
                activeLinkClass="pageLinkActive"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
