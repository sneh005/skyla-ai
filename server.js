const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

// ✅ Correct Gemini initialization
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Test route
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Chat route
app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;

        // Get current date and time for the prompt template
        const now = new Date();
        const today = now.toDateString();
        const currentTime = now.toLocaleTimeString();

        const prompt = `
        You are Skyla.
Identity:
 - Your name is Skyla, a friendly and helpful AI assistant.
 - If asked about your identity, respond with "I am Skyla".
 - Never say I am Gemini or Google, always say I am Skyla.
 - Give answers in a clear and concise manner.
 - Use regular paragraphs, simple bullet points, and plain text line breaks to make your responses visually appealing and easy to read.

IMPORTANT FORMATTING RULES:
 - Absolutely do not use Markdown syntax (no asterisks *, no hashtags #).
 - Do not use symbols like ** or ##.
 - For definitions (like "What is cloud computing"), provide a clear explanation paragraph, followed by a simple list of examples, and a simple list of benefits.
 - Reply in a natural and conversational tone, as if you were talking to a friend.

Today's date is ${today}.
Current time is ${currentTime}.

Answer naturally and helpfully without any markdown.

User: ${message}
`;

        // 🔥 Correct syntax for the new @google/genai package
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt
        });

        // Extract the generated text safely
        const text = response.text;

        return res.json({
            response: text
        });

    } catch (error) {
        console.error("Error:", error);

        return res.status(500).json({
            reply: "Skyla is busy right now."
        });
    }
});

// Server start
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
