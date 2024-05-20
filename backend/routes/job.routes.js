import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createJob, deleteJob, updateJob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/createjob', verifyToken, createJob);
router.post('/updatejob/:jobId', verifyToken, updateJob);
router.delete('/deletejob/:jobId', verifyToken, deleteJob);
export default router;