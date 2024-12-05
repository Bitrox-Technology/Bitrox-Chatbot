import dotenv from 'dotenv';
import express from 'express'
import cors from 'cors'; 
import helmet from 'helmet';
import morgan from 'morgan';
import { ApiError } from './utils/apiErrors.js';
import { userRouter } from './routes/user.js';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("Vercel to deploy Gemini AI Chatbot Backend!!!"));

app.use((req, res, next) => {
    res.append('Access-Control-Expose-Headers', 'x-total, x-total-pages');
    next();
});

app.use(helmet({
    crossOriginResourcePolicy: false,
}))
app.use(cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept",
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

morgan.format('custom', ':method :url :status :res[content-length] - :response-time ms')
app.use(morgan('custom'))


// Middleware
app.use(express.json());

// Chatbot Route
app.use("/api", userRouter)

app.use(function (err, req, res, next) {
    console.error(err);
    const status = err.status || 400;
    if (err.message == "jwt expired" || err.message == "Authentication error") { res.status(401).send({ status: 401, message: err }); }
    
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            status: err.statusCode,
            message: err.message,
            data: err.data,
            success: err.success,
            errors: err.errors
        });
    }
    else if (err.Error) res.status(status).send({ status: status, message: err.Error });
    else if (err.message) res.status(status).send({ status: status, message: err.message });
    else res.status(status).send({ status: status, message: err.message });
});


// Start Server
app.listen(PORT, () => console.log(`Server running on: ${PORT}`));
