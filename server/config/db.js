import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Report from '../models/Report.js'; // Import the Report model

dotenv.config();

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully');

    // Validate the connection and log the number of documents in the 'Reports' collection
    const isConnected = mongoose.connection.readyState === 1; // Ready state 1 means connected
    if (isConnected) {
      const reportsCount = await Report.countDocuments();
      console.log(`There are ${reportsCount} documents in the Reports collection`);
    } else {
      console.error('Failed to establish a stable connection to MongoDB');
    }
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit process with failure
  }
};

// Optional: handle unexpected disconnections gracefully
mongoose.connection.on('disconnected', () => {
  console.error('MongoDB connection lost. Attempting to reconnect...');
  connectDB();
});

export default connectDB;
