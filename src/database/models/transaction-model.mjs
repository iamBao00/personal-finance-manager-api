// models/Transaction.mjs
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const TransactionSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    amount: { type: Number, required: true },
    description: { type: String, default: "" },
    date: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Transaction = model("Transaction", TransactionSchema);

export default Transaction;
