import express from 'express';
import {connectDB} from './db/connectDB.js';
import dotenv from "dotenv"; 
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js'

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // to parse incoming requests i.e, req.body
app.use(cookieParser()); //allows us to parse incoming cookie

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port', PORT);
})

// uName:karkiravi1rk
//Password: Tu9jYDtrvh4TzkGe

// mongodb+srv://karkiravi1rk:Tu9jYDtrvh4TzkGe@cluster0.eo9i9qw.mongodb.net/