import { GoogleGenerativeAI } from '@google/generative-ai';
import { OK } from '../utils/responseCode.js';
import { ApiResponse } from '../utils/apiResponse.js';
// import { faqData } from '../FAQ.js';


// function findAnswer(prompt) {
//     for (let faq of faqData) {
//         if (prompt.toLowerCase().includes(faq.question.toLowerCase())) {
//             return faq.answer;
//         }
//     }
//     return "Sorry, I don't have the information you're looking for.";
// }


const Chatbot = async (req, res, next) => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

    const model = genAI.getGenerativeModel({ model: "tunedModels/bitrox-new-model-5flahzove0lj" });

    const { prompt } = req.body;

    // const customResponse = findAnswer(prompt);
    // if (customResponse !== "Sorry, I don't have the information you're looking for.") {
    //     return res.status(OK).json(new ApiResponse(OK, customResponse, "Successfully Generate Content"));
    // }

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
