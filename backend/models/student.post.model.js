import mongoose from 'mongoose';

const studentPostSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentComment'
    }],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }]
},{timestamps: true});

const StudentPost = mongoose.model('StudentPost', studentPostSchema);

export default StudentPost;