import express from 'express';
import { loginStudent, logoutStudent, registerNewStudent, updateStudent } from '../controllers/student.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerNewStudent);
router.post('/login', loginStudent);
router.post('/logout', logoutStudent);
router.put('/update/:studentId', verifyToken, updateStudent);

export default router;