import express from 'express';
import { getReports } from '../controllers/reportController.js';

const router = express.Router();

// Route to fetch all reports
router.get('/reports', getReports);

export default router;
