import { roomLeaveHandler } from "./roomLeaveHandler.js";
import { getActiveRooms, removeConnectedUser } from "./serverStore.js";

export const disconnectHandler = (socket) => {
  const activeRooms = getActiveRooms();

  activeRooms?.forEach((activeRoom) => {
    const userInRoom = activeRoom.participants?.some(
      (participant) => participant.socket === socket.id
    );
    if (userInRoom) roomLeaveHandler(socket, { roomId: activeRoom.roomId });
  });
  removeConnectedUser(socket.id);
};
