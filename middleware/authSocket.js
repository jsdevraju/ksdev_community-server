import jwt from 'jsonwebtoken';
import catchAsyncError from "./catchAsyncError.js";
import User from '../models/userModel.js'

export const verifyTokenSocket = catchAsyncError(async(socket, next) => {
    const token = socket.handshake.auth?.token;
    
  if (!token)
    return next(
      new Error("Invalid authorization token. please try again")
    );

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  socket.user = await User.findById(decoded.id);
  next();
})