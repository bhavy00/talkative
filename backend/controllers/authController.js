const {promisify} = require('util');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = signToken(newUser._id);
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
      token,
    },
  });
});

const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  // check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provid email and password", 400));
  }
  // check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }
  // if everything okay send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

const protect = catchAsync(async (req, res, next) => {
  // 1. Getting token and check its there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new AppError("You are not logged in! Please login to get access"), 401);
  }
  
  // 2. Verification of token
  const decoded = promisify(jwt.verify(token, process.env.JWT_SECRET));

  // 3. Check if user still exists
  const freshUser = await User.findById(decoded.id);
  if (!freshUser){
    return new AppError('The user, the token belongs to no longer exists', 401);
  }
  
  // 4. Check if user changed passwords after the token was issued
  if (freshUser.changePasswordAfter(decoded.iat)) {
    return next(new AppError('User recentely changed passwords! Please log in again', 401));
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freshUser;
  next();
});
module.exports = {
  signup,
  login,
  protect,
};
