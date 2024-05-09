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
    confirmPassword: {
        type: String,
        required: true,
       validate: {
            validator: function(pass){
                return pass === this.password;
            },
            message: 'Password are not the same'
       }
    }
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
