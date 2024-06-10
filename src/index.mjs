import express from "express";
import connectDB from "./database/connection.mjs";
import userRouter from "./api/user-routes.mjs";
import categoryRouter from "./api/category-routes.mjs";
import transactionRouter from "./api/transaction-routes.mjs";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

connectDB();

// api routes
app.use("/api/users", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/transaction", transactionRouter);
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`App is running on PORT ${PORT}`);
});
