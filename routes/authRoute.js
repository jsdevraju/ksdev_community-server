import { Router } from "express";
import { login, logout, register } from "../controllers/authCtrl.js";
import Joi from "joi";
import { createValidator } from "express-joi-validation";
import { isAuthenticated } from '../middleware/auth.js'

const router = Router();
const validator = createValidator({});

//Validation
const registerSchema = Joi.object({
  username: Joi.string().min(3).max(12).required(),
  password: Joi.string().min(8).max(32).required(),
  email: Joi.string().email().required(),
});
// Validation
const loginSchema = Joi.object({
  password: Joi.string().min(8).max(32).required(),
  email: Joi.string().email().required(),
});

// Test for api working or not
router.get("/", (req, res) => {
  res.send("Api Working");
});

//Login
router.post("/login", validator.body(loginSchema), login);
// Register
router.post("/register", validator.body(registerSchema), register);
// Logout
router.get("/logout", isAuthenticated, logout);

export default router;
