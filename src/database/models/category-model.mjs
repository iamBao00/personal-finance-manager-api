import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: ["income", "expense"] },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", CategorySchema);

export default Category;
