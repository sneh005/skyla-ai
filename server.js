const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Groq = require("groq-sdk");

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());

// Groq setup
const client = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

// Test route
app.get("/", (req, res) => {
    res.send("Skyla server is working!");
});

// Chat route
app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({
                reply: "No message received"
            });
        }

        const now = new Date();
        const today = now.toDateString();
        const currentTime = now.toLocaleTimeString();

        const prompt = `
You are Skyla, a friendly AI assistant.

Rules:
- You are Skyla only
- Never say Gemini or Google
- Give clear, simple answers

Today: ${today}
Time: ${currentTime}

User message: ${message}
`;

        const response = await client.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ]
        });

        const text = response.choices[0].message.content;

        res.json({
            reply: text
        });

    } catch (error) {
        console.error("Skyla Error:", error);

        res.status(500).json({
            reply: "Skyla is busy right now."
        });
    }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Skyla server running on port ${PORT}`);
});