import express from 'express';
import { getReports, getImage } from '../controllers/reportController.js'; // Ensure correct import
import { getOverallStats } from '../controllers/overallstats.js';


const router = express.Router();

// Route to fetch all reports
router.get('/reports', getReports);

// Route to fetch image by ID
router.get('/image/:id', getImage); // Ensure this is correctly pointing to the image retrieval function

router.get('/overallStats', getOverallStats);


export default router;