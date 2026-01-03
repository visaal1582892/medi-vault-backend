import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { configDotenv } from "dotenv";
import morgan from "morgan";
configDotenv();
import globalErrorHandler from "./middlewares/global-error-handler.js";
import connectDb from "./config/db-config.js";
import authRouter from "./routes/auth-routes.js"

// Creating Express server
const app=express();

// using some important libraries
app.use(express.json());
app.use(cors({origin: "*"}));
// {
//     origin: "http://localhost:5173",
//     credentials: true
// }
app.use(rateLimit({
    max: 100,
    windowMs: 10*60*1000
}));
app.use(morgan("dev"));

// Connecting to mongodb
await connectDb();

// configuring the routes
app.get("/", (req,res) => res.send("Hi"));
app.use("/auth", authRouter);

// configuring global exception handler
app.use(globalErrorHandler);

// server listening for requests
app.listen(process.env.PORT, () => {
    console.log(`medi-vault backend running at ${process.env.PORT}`);
});