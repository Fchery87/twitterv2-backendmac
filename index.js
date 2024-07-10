// index.js
import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import tweetsRouter from './routes/tweets.js';

// env variables && connect to MongoDB
dotenv.config();
mongoose.connect(process.env.ATLAS_URI);

const app = express();
const PORT = process.env.PORT || 4000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: ["https://silverbackchat.netlify.app/", "http://localhost:4000"], // Update with your Netlify app URL
  optionsSuccessStatus: 200,
};

app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/tweets', tweetsRouter);

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
