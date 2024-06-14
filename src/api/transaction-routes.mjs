import express from "express";
import authenticateToken from "./middleware/auth.mjs";
import TransactionService from "../services/transaction-service.mjs";

const router = express.Router();

// test github push

router.post("/add", authenticateToken, async (req, res) => {
  try {
    const { _id } = req.user;
    const { category_id, amount, description, date } = req.body;
    const transaction = await TransactionService.addTransaction(
      _id,
      category_id,
      amount,
      description,
      date
    );
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// router.delete("/delete/:id", authenticateToken, async (req, res) => {
//   try {
//     await TransactionService.deleteTransaction(req.user._id, req.params.id);
//     res.status(204).send();
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

// router.put("update/:id", authenticateToken, async (req, res) => {
//   try {
//     const transaction = await TransactionService.updateTransaction(
//       req.user._id,
//       req.params.id,
//       req.body
//     );
//     res.status(200).json(transaction);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

router.get("/list", authenticateToken, async (req, res) => {
  try {
    const transactions = await TransactionService.listAll(req.user._id);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/category/:categoryId", authenticateToken, async (req, res) => {
  try {
    const transactions = await TransactionService.findByCategory(
      req.user._id,
      req.params.categoryId
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// localhost:3000/api/transaction/date?startDate=2024-01-01&endDate=2024-12-31
router.get("/date", authenticateToken, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const transactions = await TransactionService.listFromDateToDate(
      req.user._id,
      startDate,
      endDate
    );
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
