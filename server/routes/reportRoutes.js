import { updateReportStatus } from '../controllers/reportController.js';

// Add this to your existing routes
router.put('/reports/:id/status', updateReportStatus);
