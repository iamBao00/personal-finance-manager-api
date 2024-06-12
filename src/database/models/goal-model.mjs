// models/Goal.mjs
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const GoalSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String },
    target_amount: { type: Number, required: true },
    current_amount: { type: Number, default: 0 },
    deadline: { type: Date, required: true },
    progress_history: [
      {
        amount_added: { type: Number },
        added_at: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Goal = model("Goal", GoalSchema);

export default Goal;
