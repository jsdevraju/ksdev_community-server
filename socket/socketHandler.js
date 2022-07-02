import { updateFriends, updateFriendsPendingInvitations } from "./friends.js";
import { updateRooms } from "./rooms.js";
import { addNewConnectedUser } from "./serverStore.js";

export const newConnectedHandler = (socket, io) =>{
    const userDetails = socket.user;
    // Handle Add New user
    addNewConnectedUser({
        socketId: socket.id,
        userId:userDetails?._id
    })

    // update pending friends list
    updateFriendsPendingInvitations(userDetails?._id);

    // Update friends list
    updateFriends(userDetails?._id)

    setTimeout(() =>{
        updateRooms(socket.id)
    }, [500])
}