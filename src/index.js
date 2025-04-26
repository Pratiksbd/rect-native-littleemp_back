import express from 'express';
import "dotenv/config";
import authRoutes from "./routes/authRoutes.js";
import booksRoutes from "./routes/bookRoutes.js";
import { connectDB } from './lib/db.js';
import job from './lib/cron.js';
const app = express();
const PORT = process.env.PORT || 3001;

job.start();

app.use(express.json());

app.use("/api/auth",authRoutes);
app.use("/api/books",booksRoutes);

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`);
    connectDB();
})