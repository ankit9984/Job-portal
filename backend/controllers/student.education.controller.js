import Education from "../models/student.education.model.js";
import Student from "../models/student.model.js";

const addEducation = async (req, res) => {
    try {
        const { userId } = req.user;
        const { school, degree, fieldOfStudy, startMonth, startYear, endMonth, endYear, grade, description } = req.body;

        if(startMonth || startYear || endMonth || endYear){
            if(!startMonth || !startYear || !endMonth || !endYear){
                return res.status(400).json({error: 'If any of startMonth, startYear, endMonth, or endYear is provided, all must be provided.'})
            }
        }

        if(isNaN(startYear) || isNaN(endYear)){
            return res.status(400).json({error: 'Number'})
        }

        const saveEducation = new Education({
            student: userId,
            school,
            degree,
            fieldOfStudy,
            startMonth,
            startYear,
            endMonth,
            endYear,
            grade,
            description,
        });
        
        const newEducation = await saveEducation.save();
        
        const student = await Student.findById(userId);
        student.educations.push(newEducation._id);
        await student.save();

        res.status(201).json({message: 'Educatin added successfully', newEducation})
    } catch (error) {
        console.log('Error in addEducation controller: ', error);
        res.status(500).json({ error: 'Server error' });
    }
};

const deleteEducation = async (req, res) => {
    try {
      const { userId } = req.user;
      const { educationId } = req.params;
  
      const deletedEducation = await Education.findByIdAndDelete(educationId);
  
      if (!deletedEducation) {
        return res.status(404).json({ error: 'Education entry not found' });
      }
  
      const student = await Student.findById(userId);
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }
  
      const index = student.educations.indexOf(deletedEducation._id);
      console.log(index);
      if (index > -1) {
        student.educations.splice(index, 1);
      }

    // student.educations = student.educations.filter(
    //     (education) => education._id.toString() !== deletedEducation._id.toString()
    //   );
    
      await student.save();
      res.status(200).json({ message: 'Education entry deleted successfully', deletedEducation });
    } catch (error) {
      console.error('Error in deleteEducation controller: ', error);
      res.status(500).json({ error: 'Server error' });
    }
  };

const updateEducation = async (req, res) => {
  try {
    const {userId} = req.user;
    const {educationId} = req.params;
    const { school, degree, fieldOfStudy, startMonth, startYear, endMonth, endYear, grade, description } = req.body;

    const existingEducation = await Education.findById(educationId);
    if(!existingEducation){
      return res.status(404).json({error: 'Eucation entry not found'})
    }

    const student = await Student.findById(userId);
    if(!student){
      return res.status(404).json({error: 'Student not found'})
    }

    student.educations = student.educations.filter((education) => education._id.toString() !== existingEducation._id.toString());

    await student.save();

    // Update the education entry's details
    existingEducation.school = school || existingEducation.school;
    existingEducation.degree = degree || existingEducation.degree;
    existingEducation.fieldOfStudy = fieldOfStudy || existingEducation.fieldOfStudy
    existingEducation.startMonth = startMonth || existingEducation.startMonth;
    existingEducation.startYear = startYear || existingEducation.startYear;
    existingEducation.endMonth = endMonth || existingEducation.endMonth;
    existingEducation.endYear = endYear || existingEducation.endYear;
    existingEducation.grade = grade || existingEducation.grade;
    existingEducation.description = description || existingEducation.description;

    const updatedEducation = await existingEducation.save();
    res.status(200).json({ message: 'Education entry updated successfully', updatedEducation });
  } catch (error) {
    console.error('Error in updateEducation controller: ', error);
    res.status(500).json({ error: 'Server error' });
  }
}
  
  


export {
    addEducation,
    deleteEducation,
    updateEducation
}