import Message from '../models/message.js'
import Conversation from '../models/conversation.js'
import { updateChatHistory } from './chatHandler.js';

// Handle Direct Message Handler
export const directMessageHandler = async (socket, data) =>{
    try {
        console.log(`Handle Message`)
        const { _id } = socket.user;
        const { receiverUserId, content } = data;

        // Create a new message
        const message = await Message.create({
            content,
            author:_id,
            date: new Date(),
            type:"DIRECT"
        });

        // find if conversations exits with this two user -if not create new
        const conversation = await Conversation.findOne({
            participants: {$all: [_id, receiverUserId]}
        });


        if(conversation){
            conversation.messages.push(message._id)
            await conversation.save();

            // Perform and update to sender and receiver if is online
            updateChatHistory(conversation._id.toString())
        } else {
            // create new conversations if not extis
            const newConversations = await Conversation.create({
                messages:[message._id],
                participants: [_id, receiverUserId]
            });

            // perform and update to sender and receiver if is online
            updateChatHistory(newConversations._id.toString())
        }

    } catch (error) {
        console.log(error)
    }
}