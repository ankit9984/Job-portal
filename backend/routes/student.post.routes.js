import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { addLike, createNewPost, deletePost, getAllPost, getHisAllPrivatePost, getHisAllPublicPost, savePost, updatePost} from '../controllers/student.post.controller.js';
import { createComment, deleteComment, getCommentsByPost, updateComment } from '../controllers/student.postComment.controller.js';

const router = express.Router();

router.post('/newpost', verifyToken, createNewPost);
router.put('/updatepost/:postId', verifyToken, updatePost);
router.delete('/deletepost/:postId', verifyToken, deletePost);
router.get('/getallpost', verifyToken, getAllPost);
router.get('/hispublicpost', verifyToken, getHisAllPublicPost);
router.get('/hisprivatepost', verifyToken, getHisAllPrivatePost);

//Likes
router.post('/addlikes/:postId', verifyToken, addLike);
router.post('/savepost/:postId', verifyToken, savePost);

//comment
router.post('/comments/:postId', verifyToken, createComment);
router.put('/updatecomment/:commentId', verifyToken, updateComment);
router.get('/getcomments/:postId', verifyToken, getCommentsByPost);
router.delete('/deletecomments/:commentId', verifyToken, deleteComment);

export default router;