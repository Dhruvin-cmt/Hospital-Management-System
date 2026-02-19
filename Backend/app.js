import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import { dbConnection } from "./databse/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js"

const app = express();
config({ path: "./config/.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    Credential: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

dbConnection();

export default app;
