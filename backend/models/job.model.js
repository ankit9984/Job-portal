import mongoose from 'mongoose';

const {Schema} = mongoose;

const screeningQuestionsSchema = new Schema({
    question: {
        type: String,
        required: [true, 'Screening question is required']
    },
    answer: {
        type: String,
        enum: ['yes', 'no'],
        default: null
    }
}, {_id: false})

const jobSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Job title is required'],
        trim: true,
        maxlength : [100, 'Job title cannot exceed 100 character']
    },
    location: {
        type: String,
        required: [true, 'location name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    company: {
        type: String,
        required: [true, 'Company name is required'],
        trim: true,
        maxlength: [100, 'Company name cannot exceed 100 character']
    },
    workPlaceType: {
        type: String,
        enum: ['On-site', 'Hybrid', 'Remote'],
        required: [true, 'WorkPlaceType is required']
    },
    employmentType: {
        type: String,
        enum: ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'],
        required: [true, 'Employment type is required']
    },
    salary: {
        type: Number,
        required: [true, 'Salary is required'],
        min: [0, 'Salary must be a positive number']
    },
    experienceLevel: {
        type: String,
        enum: ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'],
        required: [true, 'Experience level is required']
    },
    postedData: {
        type: Date,
        default: Date.now
    },
    applicationDeadlin: {
        type: Date,
        required: [true, 'Application deadline is required']
    },
    skills: {
        type: [String],
        required: [true, 'Skills are required']
    },
    description: {
        type: String,
        required: [true, 'Job description is required'],
        trim: true
    },
    screeningQuestions: [screeningQuestionsSchema],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }
}, {timestamps: true});

const Job = mongoose.model('Job', jobSchema);

export default Job;