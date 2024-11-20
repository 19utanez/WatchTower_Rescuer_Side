// server/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from '../models/Report.js'; // Import the Citizen model

dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
    });

    console.log('MongoDB Connected');

    // Log the number of documents in the 'Citizens' collection
    const reportsCount = await Report.countDocuments();
    console.log(`There are ${reportsCount} documents in the Reports collection`);

  } catch (error) {
    console.error('Error connecting to MongoDB', error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
