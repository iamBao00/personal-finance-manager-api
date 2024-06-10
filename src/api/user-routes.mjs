import express from "express";
import UserService from "../services/user-service.mjs";
import authenticateToken from "./middleware/auth.mjs";

const router = express.Router();
// api/users
router.post("/register", UserService.registerUser);
router.post("/login", UserService.loginUser);

router.get("/current", authenticateToken, UserService.currentUser);

export default router;
