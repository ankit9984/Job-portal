import mongoose from "mongoose";

const studentLikeSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentPost',
        required: true
    }
}, {timestamps: true});

const StudentLike = mongoose.model('StudentLike', studentLikeSchema);

export default StudentLike;