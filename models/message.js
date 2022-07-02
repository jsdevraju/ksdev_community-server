import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  content: { type: String },
  date: { type: Date },
  type: { type: String },
});

export default mongoose.model("Message", messageSchema);
