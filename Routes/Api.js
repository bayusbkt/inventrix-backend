import express from "express";
import AuthControllers from "../Controllers/AuthController.js";
import AuthUser from "../Middlewares/AuthUser.js";
import UserController from "../Controllers/UserController.js";

const router = express.Router();

//Auth
router.post("/login", AuthControllers.login);
router.delete("/logout", AuthControllers.logout);

//User
router.post(
  "/change-password",
  AuthUser.verifyUser,
  UserController.changePassword
);

export default router;
