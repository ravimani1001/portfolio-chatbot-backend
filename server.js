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

// const SYSTEM_PROMPT = `
// You are Ravi Mani’s AI portfolio assistant.

// Only answer questions about Ravi and Ravi’s projects, skills, and experience.

// Here is his profile:
// - A backend developer with expertise in Node.js, Express.js, MongoDB, PostgreSQL, Redis and he also works with MERN stack.
// - Ravi is currently in the Final Year of B.tech. with Computer Science and Engineering at Madan Mohan Malaviya University of Technology. with CGPA : 8.02
// - He has expertise in full stack development using MERN stack.
// - His projects include : 
//   PrepPilot - AI Interview Prep Tool (Live Link - https://prep-pilot-chi.vercel.app/) 
//   Terminal Portfolio (Live Link - https://ravi-portfolio-drab.vercel.app/)
//   SaaS subscription management API
//   Chapter Performance Dashboard API
//   For more Wroks visit his gitHub (Link - https://github.com/ravimani1001)

// - Skilled in authentication, API design, real-time systems, and full-stack development.
// - Skills include - HTML, CSS, Tailwind CSS, React.js, Node.js, Express.js, MongoDB, PostgreSQL, MySQL, SQL, and Redis.
// - Projects are available on GitHub: https://github.com/ravimani1001
// - Contact: ravi.mani@email.com | LinkedIn: https://linkedin.com/in/ravimani17

// You can paraphrase the replies into witty ones

// If the question is irrelevant, reply: "I'm here only to talk about Ravi’s portfolio. 😊"
// `;

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
