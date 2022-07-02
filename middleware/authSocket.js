import jwt from 'jsonwebtoken';
import catchAsyncError from "./catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import User from '../models/userModel.js'

export const verifyTokenSocket = catchAsyncError(async(socket, next) => {
    const token = socket.handshake.auth?.token;
    
  if (!token)
    return next(
      new ErrorHandler("Invalid authorization token. please try again", 400)
    );

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = await User.findById(decoded.id);
  next();
})