import Category from "../database/models/category-model.mjs";

class CategoryService {
  async createCategory(user_id, name, type) {
    try {
      const category = await Category.create({ user_id, name, type });
      return category;
    } catch (error) {
      throw new Error(`Error in creating category: ${error}`);
    }
  }

  async getCategoryById(id) {
    try {
      const category = await Category.findById(id);
      return category;
    } catch (error) {
      throw new Error(`Error in fetching category: ${error}`);
    }
  }

  async updateCategory(id, name, type) {
    try {
      const category = await Category.findByIdAndUpdate(
        id,
        { name, type },
        { new: true }
      );
      return category;
    } catch (error) {
      throw new Error(`Error in updating category: ${error}`);
    }
  }

  async deleteCategory(id) {
    try {
      await Category.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error in deleting category: ${error}`);
    }
  }

  async findAllCategoriesByUserId(user_id) {
    try {
      const categories = await Category.find({ user_id });
      return categories;
    } catch (error) {
      throw new Error(`Error in finding categories: ${error}`);
    }
  }

  async findCategoriesByType(user_id, type) {
    try {
      const categories = await Category.find({ user_id, type });
      return categories;
    } catch (error) {
      throw new Error(`Error in finding categories: ${error}`);
    }
  }
}

export default new CategoryService();
