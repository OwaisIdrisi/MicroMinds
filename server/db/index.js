import mongoose from "mongoose"

export const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to Database successfully");


    } catch (error) {
        console.log("Error While Connecting to Database", error.message);
        process.exit(1)
    }
}