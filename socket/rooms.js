import { ACTIONS } from "../socketAction.js";
import { getActiveRooms, getSocketServerInstance } from "./serverStore.js"


export const updateRooms = (toSpecifiedSocketId = null) =>{
    const io = getSocketServerInstance();
    const activeRooms = getActiveRooms();

    if(toSpecifiedSocketId){
    io.to(toSpecifiedSocketId).emit(ACTIONS.ACTIVE_ROOM, {
            activeRooms
        })
    } else{
     io.emit(ACTIONS.ACTIVE_ROOM, {
            activeRooms
        })
    }
}