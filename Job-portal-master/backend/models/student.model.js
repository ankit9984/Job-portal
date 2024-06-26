import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const studentSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    educations:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Education'
    }],
    positions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentPosition'
    }],
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentPost'
    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    savedPosts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'StudentPost'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    }],
    postJobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job'
    }]
});

// Pre-Save hook to hash the password
studentSchema.pre('save', async function(next){
    if(this.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        this.confirmPassword = undefined;
    }
    next();
});

const Student = mongoose.model('Student', studentSchema);

export default Student;
