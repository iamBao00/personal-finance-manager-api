import express from "express";
import UserService from "../services/user-service.mjs";
import authenticateToken from "./middleware/auth.mjs";
import adminOnly from "./middleware/authAdmin.mjs";

const router = express.Router();
// api/users
router.post("/register", UserService.registerUser);
router.post("/login", UserService.loginUser);

router.get("/current", authenticateToken, UserService.currentUser);

// Các API quản lý user, chỉ dành cho admin
router.post("/loginadmin", UserService.loginAdmin);
router.get("/list", authenticateToken, adminOnly, UserService.listUser);
router.delete(
  "/delete/:userId",
  authenticateToken,
  adminOnly,
  UserService.deleteUser
);
export default router;
