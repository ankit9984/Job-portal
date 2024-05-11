import mongoose from "mongoose";

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const educationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    school: {
        type: String,
        required: true
    },
    degree: {
        type: String,
    },
    fieldOfStudy: {
        type: String
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
    grade: {
        type: Number
    },
    description: {
        type: String,
        default: ''
    }
});

// Custom validation for start and end dates
// educationSchema.pre('validate', function(next) {
//     if(this.startMonth || this.startYear || this.endMonth || this.endYear){
//         if(!this.startMonth || !this.startYear || !this.endMonth || !this.endYear){
//             next(new Error('If any of startMonth, startYear, endMonth, or endYear is provided, all must be provided.'))
//         }
//     }
//     next();
// });

const Education = mongoose.model('Education', educationSchema);

export default Education;