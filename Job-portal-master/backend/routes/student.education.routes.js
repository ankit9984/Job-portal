import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { addEducation, deleteEducation, updateEducation } from '../controllers/student.education.controller.js';

const router = express.Router();

router.post('/addEducation', verifyToken, addEducation);
router.delete('/deleteEducation/:educationId', verifyToken, deleteEducation);
router.put('/updateEducation/:educationId', verifyToken, updateEducation);

export default router;