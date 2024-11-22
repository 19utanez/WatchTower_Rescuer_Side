import express from 'express';
import { getReports, getImage } from '../controllers/reportController.js'; // Ensure correct import

const router = express.Router();

// Route to fetch all reports
router.get('/reports', getReports);

// Route to fetch image by ID
router.get('/image/:id', getImage); // Ensure this is correctly pointing to the image retrieval function

export default router;
