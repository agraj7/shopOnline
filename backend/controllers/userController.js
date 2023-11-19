const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary = require("cloudinary")


// Register a user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {

  const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
    folder:"avatars",
    width:150,
    crop:"scale",
  }) 
  
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return next(new ErrorHandler("Please provide all the fields", 400));
  }
  const user = await User.create({
    //When the names are same then, we can pass values like name,email instead of name:name,email:email
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });

  sendToken(user, 201, res);
});
// exports.registerUser = catchAsyncErrors(async (req, res, next) => {
//   const { name, email, password,avatars } = req.body;
//   if (!name || !email || !password) {
//     return next(new ErrorHandler("Please provide all the fields", 400));
//   }
//   const user = await User.create({
//     //When the names are same then, we can pass values like name,email instead of name:name,email:email
//     name,
//     email,
//     password,
//     avatar: {
//       public_id: "sample id",
//       url: avatars,
//     },
//   });

//   sendToken(user, 201, res);
// });

//Login a user and get JWT Token
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please Provide Email or Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);
  if (isPasswordMatched) {
    sendToken(user, 200, res);
  } else {
    return next(new ErrorHandler("You have Invalid email or password", 401));
  }
});

//Logout a user
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

//Forgot password
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler(`No account with that email`, 404));
  }
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `You are receiving this because you requested for the password to be changed..\n\n Please click on the following link \n\n ${resetPasswordUrl} \n\n If you have not requested this email. Then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `ShopOnline Password recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `An e-mail has been sent to ${user.email} with further instructions`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hashing
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Reset Password token is invalid now", 400));
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Both passwords should be same", 400));
  }

  //Updating password and removing the tokens from database
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  sendToken(user, 200, res);
});

// GET user details (CRUD)
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id of ${req.user.id}`, 401)
    );
  }
  res.status(200).json({ 
    success: true,
     user,
     });
});

// Update and Change user password 
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  if (!user) {
    return next(
      new ErrorHandler(`User not found with id of ${req.user.id}`, 401)
    );
  }

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect", 401));
  }
  if(req.body.newPassword!==req.body.confirmPassword)
  {
    return next(new ErrorHandler('New password and confirm password do not match',400))
  }
  user.password = req.body.newPassword;
  await user.save();

  sendToken(user,200,res);
});

// Update user profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name : req.body.name,
    email : req.body.email,
  }
  if(req.body.avatar !=="")
  {
    const user = await User.findById(req.user.id);
    const imageId = user.avatar.public_id;
    await cloudinary.v2.uploader.destroy(imageId);
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
      folder:"avatars",
      width:150,
      crop:"scale",
    })
    newUserData.avatar={
      public_id:myCloud.public_id,
      url:myCloud.secure_url,
    }
  }

  const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
  res.status(200).json({
    success:true,
    message:"profile updated successfully" ,
  })
}); 

//READ all users (CRUD)      --Admin
exports.getAllUser = catchAsyncErrors( async (req,res,next)=>{
  const users=await User.find({});
  res.status(200).json({
    success: true,
    users,
  })
  })

  //READ a single user (CRUD)      --Admin
exports.getSingleUser= catchAsyncErrors( async (req,res,next)=>{
  const user=await User.findById(req.params.id);
  if(!user){
    return next(new ErrorHandler(`No such user with id ${req.params.id}`,404)
    )}

  res.status(200).json({
    success: true,
    user,
  })
  })


// Update user role                      --Admin
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {

  const newUserData = {
    name : req.body.name,
    email : req.body.email,
    role:req.body.role,
  }

let user = User.findById(req.params.id);

if(!user){
  return next(new ErrorHandler(`No such user with id ${req.params.id}`,404)
  )}

    await User.findByIdAndUpdate(req.params.id,newUserData,{
    new:true,
    runValidators:true,
    useFindAndModify:false,
  })
  res.status(200).json({
    success:true,
    message:"profile updated successfully" ,
  })
}); 


// Delete user           --Admin
exports.deleteUserProfile = catchAsyncErrors(async (req, res, next) => {
  
  let user = await User.findById(req.params.id);

  if (!user ) { 
    return next(new ErrorHandler('No Such User',400 ));
  }
  user = await User.findByIdAndDelete(req.params.id);

  const imageId = user.avatar.public_id;
  await cloudinary.v2.uploader.destroy(imageId);

  res.status(200).json({
    success:true,
    message:"profile deleted successfully" ,
  })
}); 


