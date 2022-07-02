import { ACTIONS } from "../socketAction.js";
import { updateRooms } from "./rooms.js";
import { getActiveRoom, joinActiveRoom } from "./serverStore.js";

export const roomJoinHandler = (socket, data) =>{
    const { roomId } = data;

    const participantsDetails = {
        userId:socket.user._id,
        socket:socket.id
    }

    const roomDetails = getActiveRoom(roomId);
    joinActiveRoom(roomId, participantsDetails);


    // send information to users in room that they should prepare for incoming connection
    roomDetails.participants?.forEach((participant) =>{
        if(participant.socket !== participantsDetails.socket){
            socket.to(participant.socket).emit(ACTIONS.CONN_PREPARE, {
                connUserSocketId: participantsDetails.socket
            })
        }
    });
    
    updateRooms()
}