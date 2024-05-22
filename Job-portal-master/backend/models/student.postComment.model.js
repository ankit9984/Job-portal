import mongoose from "mongoose";

const studentCommentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentPost',
        required: true
    },
    content: {
        type: String,
        required: true,
    }
},{timestamps: true});

const StudentComment = mongoose.model('StudentComment', studentCommentSchema);

export default StudentComment;