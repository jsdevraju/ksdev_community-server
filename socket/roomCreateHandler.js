import { ACTIONS } from "../socketAction.js";
import { updateRooms } from "./rooms.js";
import { addNewActiveRoom } from "./serverStore.js";

export const roomCreateHandler = (socket) => {

  const socketId = socket.id;
  const userId = socket.user?._id;

  const roomDetails = addNewActiveRoom(userId, socketId);

  socket.emit(ACTIONS.ROOM_CREATE, { roomDetails });
  updateRooms()
};

