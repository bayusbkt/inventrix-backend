import express from "express";
import AuthControllers from "../Controllers/AuthControllers.js";

const router = express.Router();

router.post("/register", AuthControllers.register);
router.post("/login", AuthControllers.login);

export default router;