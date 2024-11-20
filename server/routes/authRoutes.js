import express from 'express';
import { loginRescuer, getCitizens, registerCitizen  } from '../controllers/authController.js';
const router = express.Router();

// POST login route
router.post('/login', loginRescuer);

// GET route to fetch all citizens
router.get('/rescuer', getCitizens);

// Register route
router.post("/citizens", registerCitizen);

export default router;
