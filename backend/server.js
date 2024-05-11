import express, { urlencoded } from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import connectDB from './config/database.config.js';
import studentRoutes from './routes/student.routes.js'
import studentEducationRoutes from './routes/student.education.routes.js'

const app = express();
const PORT = process.env.PORT || 3000
dotenv.config();

app.use(express.json());
app.use(urlencoded({extended: true}));
app.use(cookieParser());

connectDB();

app.use('/api/student', studentRoutes);
app.use('/api/student/education', studentEducationRoutes);

app.listen(PORT, () => {
    console.log(`port is running on ${PORT}`);
});