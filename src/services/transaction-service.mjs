import Transaction from "../database/models/transaction-model.mjs";
import User from "../database/models/user-model.mjs";
import Category from "../database/models/category-model.mjs";
import mongoose from "mongoose";

class TransactionService {
  async addTransaction(user_id, category_id, amount, description) {
    try {
      // Tìm người dùng
      const user = await User.findById(user_id);
      if (!user) {
        throw new Error("User not found");
      }

      // Tìm category và lấy type
      const category = await Category.findById(category_id);
      if (!category) {
        throw new Error("Category not found");
      }
      const { type } = category;

      // Kiểm tra loại transaction và cập nhật balance
      let newBalance;
      if (type === "income") {
        newBalance = user.balance + amount;
      } else if (type === "expense") {
        newBalance = user.balance - amount;
        if (newBalance < 0) {
          throw new Error("Insufficient balance");
        }
      } else {
        throw new Error("Invalid category type");
      }

      // Tạo transaction mới
      const transaction = new Transaction({
        user_id,
        category_id,
        amount,
        description,
      });
      await transaction.save();

      // Cập nhật balance của user
      user.balance = newBalance;
      await user.save();

      return transaction;
    } catch (error) {
      throw error;
    }
  }

  async deleteTransaction(user_id, transaction_id) {
    try {
      const transaction = await Transaction.findOneAndDelete({
        _id: transaction_id,
        user_id,
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      const user = await User.findById(user_id);
      const category = await Category.findById(transaction.category_id);
      const { type } = category;

      if (type === "income") {
        user.balance -= transaction.amount;
      } else if (type === "expense") {
        user.balance += transaction.amount;
      }

      await user.save();
    } catch (error) {
      throw error;
    }
  }

  //   async updateTransaction(userId, transactionId, updateData) {
  //     try {
  //       const transaction = await Transaction.findOneAndUpdate(
  //         { _id: transactionId, user_id: userId },
  //         updateData,
  //         { new: true }
  //       );
  //       if (!transaction) {
  //         throw new Error("Transaction not found or user not authorized");
  //       }
  //       return transaction;
  //     } catch (error) {
  //       throw new Error(`Error updating transaction: ${error.message}`);
  //     }
  //   }

  async listAll(userId) {
    try {
      return await Transaction.find({ user_id: userId });
    } catch (error) {
      throw new Error(`Error listing transactions: ${error.message}`);
    }
  }

  async findByCategory(userId, categoryId) {
    try {
      return await Transaction.find({
        user_id: userId,
        category_id: categoryId,
      });
    } catch (error) {
      throw new Error(
        `Error finding transactions by category: ${error.message}`
      );
    }
  }

  async listFromDateToDate(userId, startDate, endDate) {
    try {
      return await Transaction.find({
        user_id: userId,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      });
    } catch (error) {
      throw new Error(
        `Error listing transactions by date range: ${error.message}`
      );
    }
  }
}

export default new TransactionService();
