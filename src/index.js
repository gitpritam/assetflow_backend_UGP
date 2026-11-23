import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.config.js";
import mainRouter from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", mainRouter);

await connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
