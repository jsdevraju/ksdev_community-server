import { Server } from "socket.io";
import { verifyTokenSocket } from "../middleware/authSocket.js";
import { newConnectedHandler } from "./socketHandler.js";
import { disconnectHandler } from "./disconnectedHandler.js";
import { getOnLineUser, setSocketServerInstance } from "./serverStore.js";
import { ACTIONS } from "../socketAction.js";
import { directMessageHandler } from "./directMessageHandler.js";
import { directChatHistoryHandler } from "./directChatHistoryHandler.js";
import { roomCreateHandler } from "./roomCreateHandler.js";
import { roomJoinHandler } from "./roomJoinHandler.js";
import { roomLeaveHandler } from "./roomLeaveHandler.js";
import { roomInitializeConnectionHandler } from "./roomInitializeConnectionHandler/roomInitializeConnectionHandler.js";
import { roomSignalingHandler } from "./roomSignalingHandler.js";


export const socketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  //Sending Io Instance
  setSocketServerInstance(io);

  //   Only Verify User Allow to access socket io server || Checking for verify
  io.use((socket, next) => {
    verifyTokenSocket(socket, next);
  });

  //Automatic remove user online
  const emitOnlineUsers = () => {
    const onlineUsers = getOnLineUser();
    io.emit(ACTIONS.ONLINE_USER, { onlineUsers });
  };

  //  Socket Io Connected
  io.on("connection", (socket) => {
    console.log(`Socket Connected ${socket.id}`);

    //When Any User Add This function fire
    newConnectedHandler(socket, io);
    emitOnlineUsers();

    //Handle Direct Message
    socket.on(ACTIONS.DIRECT_MESSAGE, (data) => {
      directMessageHandler(socket, data);
    });

    //Chat History Handler
    socket.on(ACTIONS.DIRECT_MESSAGE_HISTORY, (data) => {
      directChatHistoryHandler(socket, data);
    });

    //Room Create
    socket.on(ACTIONS.ROOM_CREATE, () => {
      roomCreateHandler(socket);
    });

    // join room
    socket.on(ACTIONS.JOIN_ROOM, (data) => {
      roomJoinHandler(socket, data);
    });

    // leave-room
    socket.on(ACTIONS.ROOM_LEAVE, (data) => {
      roomLeaveHandler(socket, data);
    });

    //Connection Initialize
    socket.on(ACTIONS.CONN_INIT, (data) => {
      roomInitializeConnectionHandler(socket, data);
    });

    // connection signal
    socket.on(ACTIONS.CONN_SIGNAL, data =>{
      roomSignalingHandler(socket, data)
    })

    //Socket Disconnected
    socket.on("disconnect", () => {
      console.log(`Socket Disconnected ${socket.id}`);
      disconnectHandler(socket);
    });
  });

  // After Disconnected 8000 sec user indicator automatic off
  setInterval(() => {
    emitOnlineUsers();
  }, [8000]);
};
