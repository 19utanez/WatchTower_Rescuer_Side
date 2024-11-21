import Report from '../models/Report.js';
import { getGfsBucket } from "../utils/gridFsUtils.js";
import mongoose from 'mongoose';

// Fetch all reports
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find();
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
    const file = await gfsBucket.find({ _id: mongoose.Types.ObjectId(id) }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).send('File not found');
    }

    gfsBucket.openDownloadStream(file[0]._id).pipe(res);
  } catch (error) {
    console.error("Error retrieving image:", error);
    res.status(500).send("Error retrieving image");
  }
};
