import Job from "../models/job.model.js";
import Student from "../models/student.model.js";

const createJob = async (req, res) => {
    try {
        const {userId} = req.user;

        const { title, description, company, location, workPlaceType, employmentType, salary, experienceLevel, applicationDeadlin, skills, screeningQuestions} = req.body;


        const newJob = new Job({
            title,
            description,
            company,
            location,
            workPlaceType,
            employmentType,
            salary,
            experienceLevel,
            applicationDeadlin,
            skills,
            screeningQuestions,
            author: userId
        });

        const saveJob = await newJob.save();
        await Student.findByIdAndUpdate(userId, {$push: {postJobs: newJob._id}}, {new: true})
        res.status(201).json(saveJob);
    } catch (err) {
        // Handle Mongoose validation errors
        if(err.name === 'ValidationError'){
            const errors = Object.values(err.errors).map(error => error.message);
            return res.status(400).json({errors});
        }
        console.log('Error in createJob controller', err);
        res.status(500).json({error: 'Server err'})
    }
};

const deleteJob = async (req, res) => {
    try {
      const { userId } = req.user;
      const { jobId } = req.params;
  
      const dltJob = await Job.findById(jobId);
      if (!dltJob) {
        return res.status(404).json({ error: 'Job not found' });
      }
      
      console.log(dltJob.author);

      if (dltJob.author.toString() !== userId) {
        return res.status(401).json({ error: 'You are not authorized to delete this post' });
      }
  
      await Job.findByIdAndDelete(jobId);
      await Student.updateMany({ postJobs: jobId }, { $pull: { postJobs: jobId } });
  
      res.status(200).json({ message: 'Job deleted successfully' });
    } catch (error) {
      console.log('Error in deleteJob controller', error);
      res.status(500).json({ error: 'Server error' });
    }
  };
  

export {
    createJob,
    deleteJob
}