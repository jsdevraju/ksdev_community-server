import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: { type: String, unique: true },
  password: { type: String },
  friends:[{type:mongoose.Schema.Types.ObjectId, ref:"User"}]
}, {
  timestamps:true
});

export default mongoose.model("User", userSchema);
