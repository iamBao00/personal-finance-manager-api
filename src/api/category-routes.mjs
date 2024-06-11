import express from "express";
import CategoryService from "../services/category-service.mjs";
import authenticateToken from "./middleware/auth.mjs";

// /api/category....
const router = express.Router();

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { user_id, name, type } = req.body;
    const category = await CategoryService.createCategory(user_id, name, type);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;
    const category = await CategoryService.updateCategory(id, name, type);
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.get("/all/:user_id", authenticateToken, async (req, res) => {
//   try {
//     const { user_id } = req.params;
//     console.log(user_id, req.user._id);
//     const categories = await CategoryService.findAllCategoriesByUserId(user_id);
//     res.json(categories);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/", authenticateToken, async (req, res) => {
  try {
    const categories = await CategoryService.findAllCategoriesByUserId(
      req.user._id
    );
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/type/:type", authenticateToken, async (req, res) => {
  try {
    const { _id } = req.user; // Lấy user_id từ req.user đã được thiết lập trong middleware authenticateToken
    const { type } = req.params;
    console.log(_id, type);
    const categories = await CategoryService.findCategoriesByType(_id, type);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
