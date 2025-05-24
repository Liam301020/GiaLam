require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/chatbot", async (req, res) => {
  const userMessage = req.body.prompt;
  if (!userMessage) return res.status(400).json({ error: "Missing prompt" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful travel assistant for Korea." },
          { role: "user", content: userMessage }
        ]
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, I couldn't understand that.";
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI Error:", err);
    res.status(500).json({ error: "Failed to fetch reply from AI." });
  }
});

app.listen(3001, () => {
  console.log("🤖 Chatbot server is running at http://localhost:3001");
});