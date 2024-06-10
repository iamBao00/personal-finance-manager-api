import mongoose from "mongoose";

const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Middleware để kiểm tra balance không âm
UserSchema.pre("save", function (next) {
  if (this.balance < 0) {
    const error = new Error("Balance cannot be negative");
    next(error);
  } else {
    next();
  }
});

const User = model("User", UserSchema);

export default User;
