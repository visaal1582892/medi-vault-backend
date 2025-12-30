import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv();

const connectDb = async () => {
    // Connecting To mongo db
    try {
        await mongoose.connect(process.env.MONGODB_CONN_URL);
        console.log("Db Connection Succesful");
    } catch (err) {
        console.error("DB Connection failed : ",err);
    }
}

export default connectDb;