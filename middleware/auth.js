import catchAsyncError from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const token = req.headers.authorization?.split("Bearer ")[1] ||  req.cookies.token;

  if (!token)
    return next(
      new ErrorHandler("invalid authorization token. please try again", 401)
    );

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decoded.id);
  next();
});