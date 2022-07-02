import Conversation from '../models/conversation.js'
import { updateChatHistory } from './chatHandler.js';

export const directChatHistoryHandler = async (socket, data) =>{
    try {
        const { _id } = socket.user;
        const { receiverUserId } = data;

        const conversation = await Conversation.findOne({
            participants: {$all: [_id, receiverUserId]},
            type:"DIRECT"
        });
        
        if(conversation) {
            updateChatHistory(conversation._id.toString(), socket.id)
        }

    } catch (error) {
        console.log(error)
    }
}