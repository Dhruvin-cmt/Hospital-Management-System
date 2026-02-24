import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from "cors";
import { config } from "dotenv";
import { dbConnection } from "./databse/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import userRouter from "./router/userRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";
import fileUpload from "express-fileupload";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();
config({ path: "./config/.env" });

app.use(
  cors({
    origin: [process.env.FRONTEND_URL, process.env.DASHBOARD_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);
app.use("/api/appointment", appointmentRouter);

dbConnection();

app.use(errorMiddleware)

export default app;
