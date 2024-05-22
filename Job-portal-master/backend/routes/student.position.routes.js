import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createNewPostion, deleteStudentPosition, updateStudentPosition } from '../controllers/student.position.controller.js';

const router = express.Router();

router.post('/', verifyToken, createNewPostion);
router.delete('/deletePosition/:positionId', verifyToken, deleteStudentPosition);
router.post('/updatePosition/:positionId', verifyToken, updateStudentPosition);

export default router;