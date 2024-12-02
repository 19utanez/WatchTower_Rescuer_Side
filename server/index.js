import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import reportRoutes from 'routes/reportRoutes.js';  // Ensure correct import

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // Add any specific origins if needed
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', reportRoutes);  // Ensure this is correctly set

const PORT = process.env.PORT || 5010;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
