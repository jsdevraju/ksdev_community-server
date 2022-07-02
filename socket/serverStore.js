import { v4 as uuidv4 } from "uuid";

const connectedUser = new Map();
let activeRooms = [];

let io = null;

//For Adding Global Using Socket
export const setSocketServerInstance = (ioInstance) => {
  io = ioInstance;
};

export const getSocketServerInstance = () => {
  return io;
};

//When New Connection Add Handle This
export const addNewConnectedUser = ({ socketId, userId }) => {
  connectedUser.set(socketId, { userId });
};

export const removeConnectedUser = (socketId) => {
  if (connectedUser.has(socketId)) {
    connectedUser.delete(socketId);
  }
};

//Only Active User
export const getActiveConnections = (userId) => {
  const activeConnections = [];
  connectedUser.forEach((value, key) => {
    if (value.userId == userId) {
      activeConnections.push(key);
    }
  });
  return activeConnections;
};

//When User Active It's show online indicator
export const getOnLineUser = () => {
  const onlineUsers = [];
  connectedUser.forEach((value, key) => {
    onlineUsers.push({ socketId: key, userId: value.userId });
  });
  return onlineUsers;
};

//Rooms
export const addNewActiveRoom = (userId, socketId) => {
  const newActiveRoom = {
    roomCreator: {
      userId,
      socketId,
    },
    participants: [
      {
        userId,
        socket: socketId,
      },
    ],
    roomId: uuidv4(),
  };

  activeRooms = [...activeRooms, newActiveRoom];
  return newActiveRoom;
};

// Get ALl Actives ROoms
export const getActiveRooms = () => {
  return [...activeRooms];
};

export const getActiveRoom = (roomId) => {
  const activeRoom = activeRooms.find(
    (activeRoom) => activeRoom.roomId == roomId
  );
  if (activeRoom) {
    return {
      ...activeRoom,
    };
  } else {
    return [];
  }
};

export const joinActiveRoom = (roomId, newParticipants) => {
  const room = activeRooms.find((room) => room.roomId == roomId);
  activeRooms = activeRooms.filter((room) => room.roomId != roomId);

  const updatedRoom = {
    ...room,
    participants: [...room?.participants, newParticipants],
  };
  activeRooms.push(updatedRoom);
};

export const leaveActionRoom = (roomId, participantsSocketId) => {
  const activeRoom = activeRooms.find((room) => room.roomId === roomId);
  if (activeRoom) {
    const copyOfActiveRooms = { ...activeRoom };

    console.log(copyOfActiveRooms.participants);

    copyOfActiveRooms.participants = copyOfActiveRooms.participants.filter(
      (participant) => participant.socket !== participantsSocketId
    );
    activeRooms = activeRooms.filter((room) => room.roomId !== roomId);

    if (copyOfActiveRooms?.participants?.length > 0) {
      activeRooms.push(copyOfActiveRooms);
    }
  }
};
