import { ACTIONS } from "../socketAction.js";
import { updateRooms } from "./rooms.js";
import { getActiveRoom, leaveActionRoom } from "./serverStore.js";


export const roomLeaveHandler = (socket, data) =>{
    const { roomId } = data;
    const activeRoom = getActiveRoom(roomId);

    if(activeRoom){
        leaveActionRoom(roomId, socket.id);
        const updatedActiveRoom = getActiveRoom(roomId);
        if(updatedActiveRoom){
            updatedActiveRoom.participants?.forEach(participant =>{
                socket.to(participant.socket).emit(ACTIONS.ROOM_PARTICIPANT_LEFT, {
                    connUserSocketId: socket.id
                })
            })
        }
        updateRooms();
    }
}