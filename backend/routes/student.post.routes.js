import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createNewPost, deletePost, getAllPost } from '../controllers/student.post.controller.js';

const router = express.Router();

router.post('/newpost', verifyToken, createNewPost);
router.delete('/deletepost/:postId', verifyToken, deletePost);
router.get('/getallpost', verifyToken, getAllPost);

export default router;