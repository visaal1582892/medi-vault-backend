import express from "express";
import cors from "cors";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
import { configDotenv } from "dotenv";
import morgan from "morgan";
configDotenv();
import globalErrorHandler from "./middlewares/global-error-handler.js";

// Creating Express server
const app=express();

// using some important libraries
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(xssClean());
app.use(rateLimit({
    max: 100,
    windowMs: 10*60*1000
}));
app.use(morgan("dev"));

// configuring the routes


// configuring global exception handler
app.use(globalErrorHandler);

// server listening for requests
app.listen(process.env.PORT, () => {
    console.log(`medi-vault backend running at ${process.env.PORT}`);
})