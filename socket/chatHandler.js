import Conversation from "../models/conversation.js";
import { ACTIONS } from "../socketAction.js";
import {
  getActiveConnections,
  getSocketServerInstance,
} from "./serverStore.js";

export const updateChatHistory = async (
  conversationId,
  toSpecifiedSocketId = null
) => {
   
  try {
    const conversation = await Conversation.findById(conversationId).populate({
      path: "messages",
      model: "Message",
      populate: {
        path: "author",
        model: "User",
        select: "username _id",
      },
    });

    
    if (conversation) {
      const io = getSocketServerInstance();

      if (toSpecifiedSocketId) {
        // initial update of chat history
        return io.to(toSpecifiedSocketId).emit(ACTIONS.DIRECT_MESSAGE_HISTORY, {
          message: conversation.messages,
          participants: conversation.participants,
        });
      }
      // check if user of this conversation are online

      // if yes emit to them update of message
      conversation.participants.forEach((userId) => {
        const activeConnections = getActiveConnections(userId.toString());

        activeConnections.forEach((socketId) => {
          io.to(socketId).emit(ACTIONS.DIRECT_MESSAGE_HISTORY, {
            message: conversation.messages,
            participants: conversation.participants,
          });
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};
