import express from 'express';
import { followAndUnfollowStudent, getFollowers, getFollowing, getStudent, loginStudent, logoutStudent, registerNewStudent, updateStudent } from '../controllers/student.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerNewStudent);
router.post('/login', loginStudent);
router.post('/logout', logoutStudent);
router.put('/update/:studentId', verifyToken, updateStudent);
router.get('/getstudent', verifyToken, getStudent);
router.get('/getfollowers/:studentId', verifyToken, getFollowers);
router.get('/getfollowing/:studentId', verifyToken, getFollowing);
router.post('/followunfollow/:studentId', verifyToken, followAndUnfollowStudent);

export default router;