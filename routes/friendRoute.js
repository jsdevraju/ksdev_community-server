import { Router } from "express";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { isAuthenticated } from "../middleware/auth.js";
import {
  postAccept,
  postInvite,
  postReject,
} from "../controllers/frientCtrl.js";

// Define Router
const router = Router();
const validator = createValidator({});

// Validation
const postFriendInvitationSchema = Joi.object({
  targetMailAddress: Joi.string().email(),
});

// Validation
const inviteDecisionSchema = Joi.object({
  id: Joi.string().required(),
});

//Route With Controller
router.post(
  "/invite-email",
  validator.body(postFriendInvitationSchema),
  isAuthenticated,
  postInvite
);
router.post(
  "/friend-invitation/accept",
  validator.body(inviteDecisionSchema),
  isAuthenticated,
  postAccept
);
router.post(
  "/friend-invitation/reject",
  validator.body(inviteDecisionSchema),
  isAuthenticated,
  postReject
);

export default router;
