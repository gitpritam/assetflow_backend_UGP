import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.config.js";
import mainRouter from "./routes/index.js";
import { globalErrorHandler } from "./middleware/globalErrorHandler.midddleware.js";
import CustomError from "./shared/utils/CustomError.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "success",
    message: "ok",
  });
});

app.use("/api", mainRouter);

// Handle 404 for undefined routes
app.use((req, res, next) => {
  next(
    new CustomError(
      `Cannot find ${req.method} ${req.originalUrl} on this server`,
      404,
    ),
  );
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
