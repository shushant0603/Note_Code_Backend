import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Routes
import authRoutes from './routes/auth.js';
import fileRoutes from './routes/file.js';


dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    // origin: 'http://localhost:5173', // Your frontend URL
    origin:'https://notecode-oz67.onrender.com',
    credentials: true, // Allow credentials (cookies, etc.)
  })
);
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));



// Routes   step 1...................................
app.use('/api/auth', authRoutes);
app.use('/api', fileRoutes);

//.....................................................

app.head("/check", (req, res) => {
  res.status(200).send(); // सिर्फ header जाएगा, body नहीं
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
app.get("/",(req,res)=>{
  res.send("Welcome to Smart College Companion Backend");
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
