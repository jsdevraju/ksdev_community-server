import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})

export default mongoose.model("Friend", friendSchema)