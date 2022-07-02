import { ACTIONS } from "../../socketAction.js";

export const roomInitializeConnectionHandler = (socket, data) =>{
    const { connUserSocketId } = data;
    const initData = {connUserSocketId: socket.id};
    socket.to(connUserSocketId).emit(ACTIONS.CONN_INIT, initData)
}