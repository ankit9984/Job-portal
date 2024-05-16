import { generateToken } from "../middlewares/auth.middleware.js";
import Student from "../models/student.model.js";
import bcrypt from 'bcryptjs';

const registerNewStudent = async (req, res) => {
    try {
        const {fullName, email, password} = req.body;

        //Input validate
        if(!fullName || !email || !password ){
            return res.status(400).json({error: 'Please fill in all required fields'})
        }

       

        const isExistingStudent = await Student.findOne({email});
        if(isExistingStudent){
            return res.status(409).json({error: 'Email is already taken'})
        };

        const newStudent = new Student({
            fullName,
            email,
            password,
        
        });
        
        const token = generateToken({userId: newStudent._id});
        res.cookie('token', token, {httpOnly: true});

        const student = await newStudent.save();

        res.status(201).json({message: 'Student register successfully', student, token})
    } catch (error) {
        console.error('Error in registerNewStudent Controllers: ', error);
        res.status(500).json('Internal server error')
    }
}

const loginStudent = async (req, res) => {
    try {
        const {email, password} = req.body;

        const isExistStudent = await Student.findOne({email});
        if(!isExistStudent){
            return res.status(401).json({error: 'Student not found'})
        };

        const isMatchPassword = await bcrypt.compare(password, isExistStudent.password);

        if(!isMatchPassword){
            return res.status(401).json({error: 'Password does not match'})
        }

        // the student information to send back
        const studentInfo = {
            id: isExistStudent._id,
            fullName: isExistStudent.fullName,
            email: isExistStudent.email
        }

        const token = generateToken({userId: studentInfo.id});
        res.cookie('token', token, {httpOnly: true});

        res.status(200).json({message: 'Login successfully', studentInfo});
    } catch (error) {
        
    }
}

const logoutStudent = async (req, res) => {
    try {
      res.cookie('token', '', { maxAge: 0, httpOnly: true }); // Set cookie to expire immediately
      res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      console.error('Error in logoutStudent Controller:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};

const updateStudent = async (req, res) => {
    try {
        const studentId = req.params.studentId;
        const {userId} = req.user;
        console.log(studentId, userId);
        const {fullName, email, password} = req.body;

        const existingStudent = await Student.findById(studentId);
        if(!existingStudent){
            return res.status(401).json({error: 'Stuent not found'})
        };

        if(existingStudent._id.toString() !== userId){
            return res.status(403).json({error: 'Unauthorized (You can only update your own profile)'})
        };

        existingStudent.fullName = fullName;
        existingStudent.email = email;

        if(password){
            const hashedPassword = await bcrypt.hash(password, 10);
            existingStudent.password = hashedPassword;
        };

        const updatedStudent = await existingStudent.save();

        res.status(200).json({message: 'Student updated successfully', updatedStudent})
    } catch (error) {
        console.error('Error in updateStudent controller: ', error);
        res.status(500).json('Internal server error')
    }
}

const getStudent = async (req, res) => {
    try {
        const {userId} = req.user;

        const student = await Student.findById(userId)
        .populate('posts')
        .populate('savedPosts');

        if(!student){
            return res.status(404).json({error: 'Student not found'});
        }

        res.status(200).json({student});
    } catch (error) {
        console.error('Error in getStudentInformation controller: ', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const followAndUnfollowStudent = async (req, res) => {
    try {
        const { userId } = req.user;
        const { studentId } = req.params;

        if (userId === studentId) {
            return res.status(400).json({ error: "Cannot follow yourself" });
        }

        // Find the student to follow
        const studentToFollow = await Student.findById(studentId);
        if (!studentToFollow) {
            return res.status(404).json({ error: "Student not found" });
        }

        const loggedInStudent = await Student.findById(userId);
        if (!loggedInStudent) {
            return res.status(404).json({ error: "Logged-in student not found" });
        }

        const followingIndex = loggedInStudent.following.indexOf(studentId);
        console.log(followingIndex);
        if (followingIndex!== -1) {
            loggedInStudent.following.splice(followingIndex, 1);
            await loggedInStudent.save();

            const removeFollowerIndex = studentToFollow.followers.indexOf(userId);
            if (removeFollowerIndex!== -1) {
                studentToFollow.followers.splice(removeFollowerIndex, 1);
                await studentToFollow.save();
            }

            return res.status(200).json({ message: "Successfully unfollowed the student" });
        } else {
            loggedInStudent.following.push(studentId);
            await loggedInStudent.save();

            studentToFollow.followers.push(userId);
            await studentToFollow.save();

            return res.status(200).json({ message: "Successfully followed the student" });
        }
    } catch (error) {
        console.error("Error in followStudent:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getFollowers = async (req, res) => {
    try {
        const { userId } = req.user;

        // Find the logged-in student
        const loggedInStudent = await Student.findById(userId).populate({
            path: 'followers',
            select: 'fullName' // Assuming fullName is the field for the name
        });

        console.log(loggedInStudent);

        if (!loggedInStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Extract followers' names
        const followers = loggedInStudent.followers.map(follower => follower.fullName);

        res.status(200).json({ followers });
    } catch (error) {
        console.error("Error in getFollowers:", error);
        res.status(500).json({ error: "Server error" });
    }
};

const getFollowing = async (req, res) => {
    try {
        const { userId } = req.user;

        // Find the logged-in student
        const loggedInStudent = await Student.findById(userId).populate({
            path: 'following',
            select: 'fullName' 
        });

        if (!loggedInStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Following names
        const following = loggedInStudent.following.map(followed => followed.fullName);

        res.status(200).json({ following });
    } catch (error) {
        console.error("Error in getFollowing:", error);
        res.status(500).json({ error: "Server error" });
    }
};

export {
    registerNewStudent,
    loginStudent,
    logoutStudent,
    updateStudent,
    getStudent,
    followAndUnfollowStudent,
    getFollowers,
    getFollowing
}

