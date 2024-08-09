import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import authRoutes from "./routes/AuthRoute.js";
import contactRoutes from "./routes/ContactRoute.js";
import setupSocket from "./socket.js";
import messagesRoutes from "./routes/MessagesRoute.js";
import channelRoutes from "./routes/ChannelRoute.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const databaseURL = process.env.MONGO_URI;

app.use(
  cors({
    origin: [process.env.ORIGIN],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/channel", channelRoutes);

const server = app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});

setupSocket(server);

mongoose
  .connect(databaseURL)
  .then(() => {
    console.log("database is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });
