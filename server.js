// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });



app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: "Message is required" });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [{ text: process.env.SYSTEM_PROMPT }],
          role: "user"
        },
        {
          parts: [{ text: message }],
          role: "user"
        }
      ]
    });

    const reply = response.text;
    res.json({ reply });
  } catch (err) {
    console.error("GenAI error:", err);
    res.status(500).json({ error: "Gemini API error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
