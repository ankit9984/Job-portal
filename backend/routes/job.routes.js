import express from 'express';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { createJob, deleteJob } from '../controllers/job.controller.js';

const router = express.Router();

router.post('/createjob', verifyToken, createJob);
router.delete('/deletejob/:jobId', verifyToken, deleteJob);
export default router;