// services/goal-service.mjs
import Goal from "../database/models/goal-model.mjs";
import Notification from "../database/models/notification-model.mjs";

class GoalService {
  async addGoal(req, res) {
    try {
      const { title, description, target_amount, deadline } = req.body;
      const userId = req.user._id;

      if (new Date(deadline) <= new Date()) {
        return res
          .status(400)
          .json({ message: "Deadline must be a future date" });
      }

      const newGoal = new Goal({
        user_id: userId,
        title,
        description,
        target_amount,
        deadline,
      });

      await newGoal.save();

      return res.status(201).json(newGoal);
    } catch (error) {
      console.error(`Error from GoalService.addGoal: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async addAmountToGoal(req, res) {
    try {
      const { amount } = req.body;
      console.log("Tiền thêm vào: " + amount);
      const { goalId } = req.params;
      const userId = req.user._id;

      const goal = await Goal.findById(goalId);

      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }

      if (goal.user_id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      console.log("Tiền hiện có" + goal.current_amount);
      const newAmount = Number(goal.current_amount) + Number(amount);
      console.log("TIền sau khi thêm" + newAmount);
      console.log("Target Amout: " + goal.target_amount);
      if (newAmount > goal.target_amount) {
        return res.status(400).json({ message: "Cannot exceed target amount" });
      }

      goal.current_amount = newAmount;
      goal.progress_history.push({ amount_added: amount });

      if (newAmount >= goal.target_amount) {
        const notification = new Notification({
          user_id: userId,
          message: `Congratulations! You have reached your goal: ${goal.title}`,
        });
        await notification.save();
      }

      await goal.save();

      return res.status(200).json(goal);
    } catch (error) {
      console.error(`Error from GoalService.addAmountToGoal: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async updateGoal(req, res) {
    try {
      const { goalId } = req.params;
      const { title, description, target_amount, deadline } = req.body;
      const userId = req.user._id;

      const goal = await Goal.findById(goalId);

      if (!goal) {
        return res.status(404).json({ message: "Goal not found" });
      }

      if (goal.user_id.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (deadline && new Date(deadline) <= new Date()) {
        return res
          .status(400)
          .json({ message: "Deadline must be a future date" });
      }
      console.log("Target: " + target_amount);
      console.log("Current amout: " + goal.current_amount);
      if (Number(target_amount) < goal.current_amount) {
        return res.status(400).json({
          message: "Target amount cannot be less than current amount",
        });
      }

      goal.title = title || goal.title;
      goal.description = description || goal.description;
      goal.target_amount = target_amount || goal.target_amount;
      goal.deadline = deadline || goal.deadline;

      await goal.save();

      return res.status(200).json(goal);
    } catch (error) {
      console.error(`Error from GoalService.updateGoal: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async listGoals(req, res) {
    try {
      const userId = req.user._id;
      const goals = await Goal.find({ user_id: userId });
      return res.status(200).json(goals);
    } catch (error) {
      console.error(`Error from GoalService.listGoals: ${error}`);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
}

export default new GoalService();
