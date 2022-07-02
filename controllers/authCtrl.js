import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login
export const login = catchAsyncError(async (req, res, next) => {
    const { email, password} = req.body;
    //Checking user exits or not
    const user = await User.findOne({email});
    if(!user) return next(new ErrorHandler("Invalid credentials", 400));

    // Checking password same or not
    const hashPassword = await bcrypt.compare(password, user.password);
    if(!hashPassword)  return next(new ErrorHandler("Invalid credentials", 400));

    //Generate User Token
    const token = generateToken(user._id, process.env.JWT_SECRET);
    //Only Send Some Info Not All
    const { password: myPassword, __v, ...userInfo } = user._doc;

    res.cookie("token", token, {
        httpOnly: true,
      });

    res.status(200).json({
        message:"true",
        user:userInfo,
        token
    })

});
// Register
export const register = catchAsyncError(async (req, res, next) => {
  const { username, email, password } = req.body;

  //Checking user already exits or not
  const userEmail = await User.findOne({ email });
  if (userEmail) return next(new ErrorHandler("Email Already Exits", 400));

  const userName = await User.findOne({ username });
  if (userName) return next(new ErrorHandler("Username Already Taken", 400));

  // Username validation
  const newUserName = username.toLowerCase().replace(/ /g, "");

  //Encryption Password
  const hashPassword = await bcrypt.hash(password, 12);

  // Create a new user and save db
  const user = await User.create({
    username: newUserName,
    email,
    password: hashPassword,
  });

  const { password: myPassword, __v, ...userInfo } = user._doc;

  //Generate User Token
  const token = generateToken(user._id, process.env.JWT_SECRET)

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.status(201).json({
    message: "true",
    user:userInfo,
    token,
  });
});
// Logout
export const logout = catchAsyncError(async(req, res, next) =>{
    res
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .status(200)
    .json({
      message: "Logged Our Successfully",
      token: null,
      user: null,
    });
})

//Code Refactor
function generateToken  (userId, secret) {
    //Generate User Token
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "1y",
  });
}
