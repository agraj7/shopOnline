const express= require("express");
const app=express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error")
const bodyParser = require("body-parser")
const fileUpload = require("express-fileupload")

//it is used to convert the body code into json.
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use(fileUpload())

//Route Imports
const product = require("./routes/productRoute.js");
const user= require("./routes/userRoute.js");
const order = require("./routes/orderRoute.js");

//it is used to call the product route, user route, order route
app.use("/api/v1",product);
app.use("/api/v1",user);
app.use("/api/v1",order);


//middleware for error
app.use(errorMiddleware);

module.exports=app;