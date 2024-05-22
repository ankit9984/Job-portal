import mongoose from 'mongoose';
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const studentPositionSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    title: {
        type: String,
        required: true
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Self-employed', 'Freelance', 'Internship', 'Trainee']
    },
    companyName: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    locationType: {
        type: String,
        enum: ['On-site', 'Remote', 'Hybrid']
    },
    startMonth: {
        type: String,
        enum: monthNames
    },
    startYear: {
        type: Number,
    },
    endMonth: {
        type: String,
        enum: monthNames
    },
    endYear: {
        type: Number,
    },
    description: {
        type: String
    },
    profileHeadline: {
        type: String
    }
});

const StudentPosition = mongoose.model('StudentPosition', studentPositionSchema);

export default StudentPosition;