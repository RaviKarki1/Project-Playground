import mongoose from "mongoose";

export const connectDB = async () => {
    try{
        const conn  = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connection established : ${conn.connection.host}`);
    }catch(err){
        console.log(`Error in conneciton : ${err.message}`);
        process.exit(1);
    }
}