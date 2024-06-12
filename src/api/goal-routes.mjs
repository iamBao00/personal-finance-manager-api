// routes/goal-routes.mjs
import express from "express";
import GoalService from "../services/goal-service.mjs";
import authenticateToken from "./middleware/auth.mjs";

const router = express.Router();

// API để thêm Goal
router.post("/add", authenticateToken, GoalService.addGoal);

// API để thêm amount vào Goal
router.post(
  "/addAmount/:goalId",
  authenticateToken,
  GoalService.addAmountToGoal
);

// API để cập nhật Goal
router.put("/update/:goalId", authenticateToken, GoalService.updateGoal);

// API để lấy danh sách các Goal của người dùng
router.get("/list", authenticateToken, GoalService.listGoals);

export default router;
