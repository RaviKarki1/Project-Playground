import mongoose from "mongoose";

export const connectDB = async (req, res) => {
    try{

        const conn = await  mongoose.connect(process.env.MONGO_URI);

        console.log(`successfully connected to mongodb!!!`);
    }catch(err){
        console.log(`Error connecting to mongodb: ${err}`);
    }
}