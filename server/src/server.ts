import express from 'express';
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import http from "http";
import dotenv from "dotenv";
import userRouter from './routes/userRouter';
import taskRouter from './routes/taskRouter';
import { setupSwagger } from "./swagger";

dotenv.config();

const app = express();
const mongoUrl = process.env.MONGO_URL;
const server = http.createServer(app);

app.use(cookieParser());

// Prevent caching of API responses
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use('/', userRouter);
app.use('/tasks', taskRouter);

if (!mongoUrl) {
  throw new Error("MONGO_URL is not defined in environment variables");
}
mongoose
  .connect(mongoUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
  res.send("Hello, TypeScript!");
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({
    success: false,
    error: message
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

export default app;
