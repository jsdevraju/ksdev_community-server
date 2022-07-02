import { ACTIONS } from "../socketAction.js";
import Friend from "../models/FriendModel.js";
import User from "../models/userModel.js";
import {
  getActiveConnections,
  getSocketServerInstance,
} from "../socket/serverStore.js";

export const updateFriendsPendingInvitations = async (userId) => {
  try {
    //Find All ReceiverId And Populate Data
    const pendingInvitations = await Friend.find({
      receiverId: userId,
    }).populate("senderId", "_id username email");

    // find if user of specified userId has active connections
    const receiverList = getActiveConnections(userId);

    //Emit event using global socket server instance
    const io = getSocketServerInstance();

    receiverList.forEach((receiverSocketId) => {
      io.to(receiverSocketId).emit(ACTIONS.FRIENDS_INVITATIONS, {
        pendingInvitations: pendingInvitations ? pendingInvitations : [],
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export const updateFriends = async (userId) => {
  try {
    //Find Active connections of spefic id (online user);
    const receiverList = getActiveConnections(userId);

    if (receiverList.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id username email"
      );

      if (user) {
        const friendsList = user.friends?.map((f) => {
          return {
            id: f?._id,
            email: f?.email,
            username: f?.username,
          };
        });

        //Emit event using global socket server instance
        const io = getSocketServerInstance();

        receiverList.forEach((receiverSocketId) => {
          io.to(receiverSocketId).emit(ACTIONS.FRIENDS_LIMIT, {
            friends: friendsList ? friendsList : [],
          });
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
