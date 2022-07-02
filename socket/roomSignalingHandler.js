import { ACTIONS } from "../socketAction.js"

export const roomSignalingHandler = (socket, data) =>{
    const { connUserSocketId, signal } = data;
    const signalingData = { signal, connUserSocketId: socket.id}
    socket.to(connUserSocketId).emit(ACTIONS.CONN_SIGNAL, signalingData);
}