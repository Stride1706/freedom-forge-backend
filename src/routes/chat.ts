import express from "express";
import { generateChatResponse } from "../services/aiService";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message required" });
    }

    const reply = await generateChatResponse(message);

    res.json({ reply });

  } catch (error: any) {
    console.error("FULL ERROR:", error);

    res.status(500).json({
      error: "AI failed",
      details: error?.message || error
    });
  }
});

export default router;