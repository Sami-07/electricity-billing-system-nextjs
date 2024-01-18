
import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
    }
    catch (error) {
        console.log(error);
    }
}