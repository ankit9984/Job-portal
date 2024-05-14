import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createNewPost, deletePost, getAllPost, getHisAllPrivatePost, getHisAllPublicPost, updatePost} from '../controllers/student.post.controller.js';

const router = express.Router();

router.post('/newpost', verifyToken, createNewPost);
router.put('/updatepost/:postId', verifyToken, updatePost);
router.delete('/deletepost/:postId', verifyToken, deletePost);
router.get('/getallpost', verifyToken, getAllPost);
router.get('/hispublicpost', verifyToken, getHisAllPublicPost);
router.get('/hisprivatepost', verifyToken, getHisAllPrivatePost);

export default router;