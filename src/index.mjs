import express from "express";
import connectDB from "./database/connection.mjs";
import userRouter from "./api/user-routes.mjs";
import categoryRouter from "./api/category-routes.mjs";
import transactionRouter from "./api/transaction-routes.mjs";
import cors from "cors";

const app = express();

const corsOptions = {
  origin: "*", // Cho phép tất cả các nguồn gốc
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

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
