import Student from "../models/student.model.js";
import StudentPosition from "../models/student.position.model.js"

const createNewPostion = async (req, res) => {
    try {
       const {userId} = req.user;
       const student = await Student.findById(userId);
       if(!student){
            return res.status(404).json({error: 'User not found'})
       };

       const { title, employmentType, companyName, location, locationType, startMonth, startYear, endMonth, endYear, description, profileHeadline } = req.body;
       if(!title || !employmentType || !companyName){
            return res.status(400).json({error: 'Missing required fields'})
       }

       //Create a new positiono with the validated data
       const newPosition = new StudentPosition({
            title,
            employmentType,
            companyName,
            location,
            locationType,
            startMonth,
            startYear,
            endMonth,
            endYear,
            description,
            profileHeadline,
            student: student._id
       });

        // student.positions.push(newPosition._id);
        // await student.save();

        await Student.findByIdAndUpdate(student._id, {$push: {positions: newPosition._id}}, {new: true})

       // Save the new position to the database
       const savePosition = await newPosition.save();

       res.status(201).json({message: 'New Position added successfully', position: savePosition})
    } catch (error) {
        console.error('Error creating student position:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

const deleteStudentPosition = async (req, res) => {
    try {
        const {userId} = req.user;
        const {positionId} = req.params;

        const student = await Student.findById(userId);
        if(!student){
            return res.status(404).json({error: 'Position not found'});
        }

        const deletedPosition = await StudentPosition.findById(positionId);
        if(!deletedPosition){
            return res.status(404).json({error: 'Position not found'})
        }

        // Check position belongs to the current user
        if(!student.positions.includes(positionId)){
            return res.status(403).json({error: 'You are not authorized to delete this position'})
        }

        await Student.findByIdAndUpdate(userId, {
            $pull: {positions: positionId}
        }, {new: true});

        await StudentPosition.deleteOne({_id: positionId})
        res.status(200).json({ message: 'Position deleted successfully', deletedPosition });
    } catch (error) {
        console.error('Error deleting student position:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

const updateStudentPosition = async (req, res) => {
    try {
        const {userId} = req.user;
        const {positionId} = req.params;
        const {title, employmentType, companyName, ...rest} = req.body;

        const student = await Student.findById(userId);
        if(!student){
            return res.status(404).json({error: 'Student not found'})
        }

        if (!student.positions.includes(positionId)) {
            console.log(student.positions, positionId.toString());
            return res.status(403).json({ error: 'You are not authorized to update this position' });
        }
        

        const updatedPostion = await StudentPosition.findByIdAndUpdate(
            positionId,
            {$set: {title, employmentType, companyName, ...rest}},
            {new: true}
        );

        if(!updatedPostion){
            return res.status(404).json({error: 'Position not found'});
        }

        res.status(200).json({message: 'Position updated successfully', updatedPostion})
    } catch (error) {
        console.error('Error updating student position:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

export {
    createNewPostion,
    deleteStudentPosition,
    updateStudentPosition
}