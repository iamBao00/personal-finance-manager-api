// models/Notification.mjs
import mongoose from "mongoose";

const { Schema, model } = mongoose;

const NotificationSchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    read: { type: Boolean, default: false },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Notification = model("Notification", NotificationSchema);

export default Notification;
