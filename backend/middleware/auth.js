const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// For allowing only logged in users to do some tasks.
exports.isAuthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return next(new ErrorHandler("Please login again to access this resource.",401));
    }

    const decodedData = jwt.verify(token,process.env.JWT_SECRET);
    await User.findById(decodedData.id);
    req.user = await User.findById(decodedData.id);
    next();
})

// for allowing only admin to access few features.
exports.authorizeRoles = (...roles) =>{
    return (req, res, next)=> {
        if(!roles.includes(req.user.role))
        {
            return next(new ErrorHandler(`${req.user.role} is not authorized for this action`,403));
        }
        next();
    }
}