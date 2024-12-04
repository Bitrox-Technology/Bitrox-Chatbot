const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet')
const dotenv = require("dotenv")
const { GoogleGenerativeAI } = require('@google/generative-ai');
dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
    res.append('Access-Control-Expose-Headers', 'x-total, x-total-pages');
    next();
});

app.use(helmet())
app.use(cors({
    "origin": "https://bitrox-chatbot-frontend-68jdzhcnd-ashishs-projects-cab18589.vercel.app",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204
}));

app.get("/", (req, res) => res.send("Express on Vercel."));

// Middleware
app.use(bodyParser.json());

// Google Generative AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Chatbot Route
app.post('/api/chat', async (req, res) => {
    const { prompt } = req.body;

    try {
        const result = await model.generateContent(prompt);
        res.json({ response: result.response.text() });
    } catch (error) {
        console.error('Error generating response:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on: ${PORT}`));
