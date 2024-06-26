import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/database.config.js';
import studentRoutes from './routes/student.routes.js'
import studentEducationRoutes from './routes/student.education.routes.js'
import studentPostionRoutes from './routes/student.position.routes.js';
import studentPostRoutes from './routes/student.post.routes.js'
import jobRoutes from './routes/job.routes.js';

const app = express();
const PORT = process.env.PORT || 3000
dotenv.config();

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

connectDB();

app.use('/api/student', studentRoutes);
app.use('/api/student/education', studentEducationRoutes);
app.use('/api/student/position', studentPostionRoutes);

//Post routes
app.use('/api/student/post', studentPostRoutes);
app.use('/api/job', jobRoutes);

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`);
});