import ErrorHandler from "../utils/errorHandler.js";
import catchAsyncError from "../middleware/catchAsyncError.js";
import User from '../models/userModel.js';
import Friend from '../models/FriendModel.js'
import { updateFriends, updateFriendsPendingInvitations } from "../socket/friends.js";

//When user click to invite email fire this function
export const postInvite = catchAsyncError(async(req, res, next) =>{
    const { targetMailAddress } = req.body;

    const { _id, email } = req.user;

    //Checking if friend that we would like to invite is not user
    if(email == targetMailAddress) return next(new ErrorHandler("You can't send invite your email", 400));

    //Checking user invite user exits or not
    const targetUser = await User.findOne({ email: targetMailAddress});
    if(!targetUser) return next(new ErrorHandler("User doesn't exits in our db", 400));

    //check if invitation already sent
    const invitationAlreadyReceived = await Friend.findOne({
        senderId: _id,
        receiverId:targetUser?._id
    });

    if(invitationAlreadyReceived) return next(new ErrorHandler("Invitation Already Sent", 400));

    //Checking if the user which we would like to invite already our friend
    const usersAlreadyFriends = targetUser?.friends.find(friendId => friendId.toString() == _id.toString());
    if(usersAlreadyFriends) return  next(new ErrorHandler("Friend already added", 400))

    //Create a new invitation
    const newInvitation = await Friend.create({
        senderId:_id,
        receiverId:targetUser?._id
    });

    // if invitation has been successfully created we would like to update friends invitations if other user is online

    // Send pending invitations update specific user
    updateFriendsPendingInvitations(targetUser._id.toString())


    res.status(200).json({
        message:"Invitation Sent"
    })
})

//When Any User Accept Friends Request
export const postAccept = catchAsyncError(async(req, res, next) =>{
 
    const { id } = req.body;

    const invitation = await Friend.findById(id);
    if(!invitation) return next(new ErrorHandler("Friends Doesn't exits", 400));

    const { senderId, receiverId} = invitation;
    // add friends to both user
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // Delete Invitations after added friends
    await Friend.findByIdAndDelete(id);

    //update list of the friends if the users are online
    updateFriends(senderId.toString());
    updateFriends(receiverId.toString());

    // update list of friends pending invitations
    updateFriendsPendingInvitations(receiverId.toString());
    
    res.status(200).json({
        message:"Invitation Accept"
    })
})

//When Any User Reject Friends Request
export const postReject = catchAsyncError(async(req, res, next) =>{

    const { id } = req.body;
    const { _id } = req.user;

    // Remove Invitations from friend invitations collections
    const invitationsExits = await Friend.exists({_id : id})

    //If User Exits Delete Form Db
    if(invitationsExits) await Friend.findByIdAndDelete(id);

    //Update pending invitations
    updateFriendsPendingInvitations(_id)

    res.status(200).json({
        message:"Invitation Reject"
    })
})