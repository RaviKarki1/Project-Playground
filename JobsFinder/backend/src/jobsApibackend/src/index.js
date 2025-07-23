import express from 'express';
import dotenv from 'dotenv';
import jobsRoutes from "./routes/jobs.route.js"


dotenv.config({path: "../../../.env"})

const port = process.env.PORT || 3000;

const app = express()
app.use(express.json())
app.use('/api', jobsRoutes)

app.get('/', (req, res) => {
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})