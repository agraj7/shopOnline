const express= require("express");
const app=express();
const cors = require ("cors")
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")
const dotenv = require ("dotenv");



dotenv.config({path:"config/config.env"})

  
  app.use(
    cors({
      origin:"https://shop-online-lake.vercel.app",
      credentials: true,
    })
  );

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

//Route Imports
const product = require("./routes/productRoute.js");
const user= require("./routes/userRoute.js");
const order = require("./routes/orderRoute.js");
const payment =require("./routes/paymentRoute.js")

//it is used to call the product route, user route, order route
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);
app.use("/api/v1",payment);

//middleware for error
app.use(errorMiddleware);

module.exports=app;