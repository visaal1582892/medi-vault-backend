import express from "express";
import { configDotenv } from "dotenv";
configDotenv();
const app=express();



app.listen(process.env.PORT, () => {
    console.log(`medi-vault backend running at ${process.env.PORT}`);
})