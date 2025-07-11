import express from "express";
import dotenv from "dotenv";

import router  from "./Routes/auth.routes.js";

import { connectDB } from "./db/connectDb.js";


dotenv.config();
const app = express();

const port=process.env.PORT;



app.get('/', (req, res) => {
    res.send("Hello world");
})

app.use(express.json())

app.use("/api/auth/", router);

app.listen(port, ()=> {
    connectDB();
    console.log("Hello world")
}) 