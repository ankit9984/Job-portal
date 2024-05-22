import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createJob, deleteJob, getAllJobs, getJob, searchJobs, updateJob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/createjob', verifyToken, createJob);
router.post('/updatejob/:jobId', verifyToken, updateJob);
router.get('/getjob/:jobId', verifyToken, getJob);
router.get('/getalljobs', verifyToken, getAllJobs)
router.delete('/deletejob/:jobId', verifyToken, deleteJob);
router.get('/search', verifyToken, searchJobs);
export default router;