import Report from '../models/Report.js';
import { getGfsBucket } from "../utils/gridFsUtils.js";
import mongoose from 'mongoose';

// Fetch all verified reports
export const getReports = async (req, res) => {
  try {
    // Find reports where disasterStatus is "verified"
    const reports = await Report.find({ disasterStatus: 'verified' });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch reports', error: error.message });
  }
};



// Fetch image by ID
export const getImage = async (req, res) => {
  const { id } = req.params;
  const gfsBucket = getGfsBucket();

  try {
    const file = await gfsBucket.find({ _id: new mongoose.Types.ObjectId(id) }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: 'File not found' });
    }

    // Stream the image to the client
    res.set('Content-Type', file[0].contentType || 'application/octet-stream');
    gfsBucket.openDownloadStream(file[0]._id).pipe(res);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).json({ message: 'Error retrieving image', error: error.message });
  }
};
