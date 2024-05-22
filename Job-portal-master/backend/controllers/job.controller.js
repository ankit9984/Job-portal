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

const updateJob = async (req, res)=> {
  try {
    const {userId} = req.user;
    const {jobId} = req.params;
    const {title, description, company, location, workPlaceType, employmentType, salary, experienceLevel, applicationDeadlin, skills, screeningQuestions} = req.body;

    const jobToUpdate = await Job.findById(jobId);
    if(!jobToUpdate){
      return res.status(404).json({error: 'Job not found'})
    }
    if(jobToUpdate.author.toString() !== userId){
      return res.status(401).json({error: 'You are not authorized to update this post'})
    }

    //Enum validation for workPlaceType
    const validWorkPlaceTypes = ['On-site', 'Hybrid', 'Remote'];
    if(workPlaceType && !validWorkPlaceTypes.includes(workPlaceType)){
      return res.status(400).json({error: 'Invalid work place type'})
    }

    const validExperienceLevel =  ['Entry-level', 'Mid-level', 'Senior-level', 'Executive'];
    if(experienceLevel && !validExperienceLevel.includes(experienceLevel)){
      return res.status(400).json({error: 'Invalid experience level'})
    }

    // Enum validation for employmentType
    const validEmploymentTypes = ['Full-time', 'Part-time', 'Contract', 'Temporary', 'Internship'];
    if (employmentType &&!validEmploymentTypes.includes(employmentType)) {
        return res.status(400).json({ error: 'Invalid employment type' });
    }

    jobToUpdate.title = title || jobToUpdate.title;
    jobToUpdate.description = description || jobToUpdate.description;
    jobToUpdate.company = company || jobToUpdate.company;
    jobToUpdate.location = location || jobToUpdate.location;
    jobToUpdate.workPlaceType = workPlaceType || jobToUpdate.workPlaceType;
    jobToUpdate.employmentType = employmentType || jobToUpdate.employmentType;
    jobToUpdate.salary = salary || jobToUpdate.salary;
    jobToUpdate.experienceLevel = experienceLevel || jobToUpdate.experienceLevel;
    jobToUpdate.applicationDeadlin = applicationDeadlin || jobToUpdate.applicationDeadlin;
    jobToUpdate.skills = skills || jobToUpdate.skills;
    jobToUpdate.screeningQuestions = screeningQuestions || jobToUpdate.screeningQuestions;

    const updatedJob = await jobToUpdate.save();
    res.status(200).json(updatedJob);
  } catch (error) {
    console.error('Error in updateJob controller', error);
    res.status(500).json({error: 'Server error'})
  }
}

const getJob = async (req, res) => {
  try {
    const {jobId} = req.params;
    const job = await Job.findById(jobId);
    if(!job){
      return res.status(404).json({error: 'Job not found'})
    }
    res.status(200).json({message: 'Fetch job successfully', job})
  } catch (error) {
    console.error('Error in getJobById controller', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const getAllJobs = async (req, res) => {
  try {
    const job = await Job.find().populate('author', 'fullName email').sort({postedDate: -1});
    res.status(200).json({message: 'Fetching all jobs successfully', job})
  } catch (error) {
    console.error('Error in getAllJobs controller', error);
    res.status(500).json({ error: 'Server error' });
  }
}

const searchJobs = async (req, res) => {
  try {
    const { title, company, location, workPlaceType, employmentType, experienceLevel, skills } = req.query;

    // Construct filter object
    const filter = {};
    if (title) filter.title = { $regex: title, $options: 'i' }; 
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (workPlaceType) filter.workPlaceType = workPlaceType;
    if (employmentType) filter.employmentType = employmentType;
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (skills) filter.skills = { $in: skills.split(',') };

    const jobs = await Job.find(filter)
      .populate('author', 'name email username')
      .sort({ postedDate: -1 });

      console.log(filter);

    res.status(200).json({ message: 'Fetching search results successfully', jobs });
  } catch (error) {
    console.error('Error in searchJobs controller', error);
    res.status(500).json({ error: 'Server error' });
  }
};


// const searchJobs = async (req, res) => {
//   try {
//       const { query } = req.query;
//       const jobs = await Job.find({
//           $or: [
//               { title: { $regex: query, $options: 'i' } },
//               { company: { $regex: query, $options: 'i' } },
//               { location: { $regex: query, $options: 'i' } }
//           ]
//       }).populate('author');

//       res.status(200).json(jobs);
//   } catch (error) {
//       console.error('Error in searchJobs controller', error);
//       res.status(500).json({ error: 'Server error' });
//   }
// };


export {
    createJob,
    deleteJob,
    updateJob,
    getJob,
    getAllJobs,
    searchJobs
}