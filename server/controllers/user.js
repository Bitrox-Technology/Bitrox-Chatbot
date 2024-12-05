import { GoogleGenerativeAI } from '@google/generative-ai';
import { OK } from '../utils/responseCode.js';
import { ApiResponse } from '../utils/apiResponse.js';
// Google Generative AI Configuration


// Chatbot Route
const Chatbot = async (req, res, next) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const { prompt } = req.body;

    try {
        const result = await model.generateContent(prompt);
        return res.status(OK).json(new ApiResponse(OK, result.response.text(), "Successfully Generate Content"))

    } catch (error) {
        console.error('Error generating response:', error.message);
        next(error)
    }
};

export {
    Chatbot
}
