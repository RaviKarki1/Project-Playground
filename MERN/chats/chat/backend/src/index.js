import express from 'express';
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "../src/routes/auth.route.js";
import messageRoutes from "../src/routes/message.route.js"

import {connectDB} from "../src/lib/db.js";

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use('/api/auth', authRoutes);
app.use('/api/message ', messageRoutes);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    connectDB();
})
