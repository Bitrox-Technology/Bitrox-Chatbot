import express from 'express'
import {Chatbot} from "../controllers/user.js";

const userRouter = express.Router();


userRouter.post('/chat', Chatbot)


export{
    userRouter
}