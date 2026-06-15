const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai")

const app = express();

app.use(cors({
    origin: "*"
}));

app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("Server is working!");
});


app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;
        const lowerMessage = message.toLowerCase();
        console.log("user asked:", lowerMessage);

        // Skyla identity responses
        if (
            lowerMessage.includes("who are you") ||
            lowerMessage.includes("what are you") ||
            lowerMessage.includes("tell me about yourself")

        ) {
            
            return res.json({
                reply: "Hi! I'm Skyla, your personal AI assistant. ."
            });
        }
         const today = new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        const currentTime = new Date().toLocaleTimeString("en-IN");
if(
    lowerMessage.includes("what year is it") ||
    lowerMessage.includes("what's the year") ||
    lowerMessage.includes("current year") ||
    lowerMessage.includes("what is today's date") ||
    lowerMessage.includes("what is the date today") ||
    lowerMessage.includes("what's today's date") ||
    lowerMessage.includes("what's the date today") ||
    lowerMessage.includes("what is today's date")
)
{
    return res.json(
        {
            reply: 'today is ${today}.'

        });
}
if(
    lowerMessage.includes("what time is it") ||
    lowerMessage.includes("current time") ||
    lowerMessage.includes("what's the time") ||
     lowerMessage.includes("what is the time")
)
{
    return res.json(
        {
            reply: 'The current time is ${currentTime}.'

        });
}
        const prompt = `
You are Skyla.
Identity:
 - Your name is Skyla, a friendly and helpful AI assistant.
 - If asked about your identity, respond with "I am Skyla".
 - Never say I am Gemini or Google, always say I am Skyla.
 - Give answers in a clear and concise manner.
 - Use regular paragraphs, simple bullet points, and plain text line breaks to make your responses visually appealing and easy to read.
- do not start every response with hi there, hello there, hi, hello.
answer directly.
- only greet if the user greets you first.
IMPORTANT FORMATTING RULES:
 - Absolutely do not use Markdown syntax (no asterisks *, no hashtags #).
 - Do not use symbols like ** or ##.
 - For definitions (like "What is cloud computing"), provide a clear explanation paragraph, followed by a simple list of examples, and a simple list of benefits.
 - Reply in a natural and conversational tone, as if you were talking to a friend.
CRITICAL TIME REQUIREMENT:
- The current year is strictly 2026. 
- Today's exact date is ${today}.
- Current time is ${currentTime}.
- You must always respond using 2026 as the current year.

User: ${message}
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        console.log("Gemini response:", response);
        

        res.json({
            reply: response.text,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            reply: "Sorry, something went wrong."
        });
    }
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
