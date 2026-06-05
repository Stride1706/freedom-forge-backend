import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import chatRoute from "./routes/chat";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/chat", chatRoute);

app.get("/", (req, res) => {
  res.send("Server working ✅");
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});