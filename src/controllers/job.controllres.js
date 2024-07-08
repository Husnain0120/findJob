import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from "../utils/ApiResponse.js"
import { Job } from '../model/jobs.model.js';

// Get all jobs
const getAllJob = asyncHandler(async (req, res, next) => {
    const jobs = await Job.find({ expired: false }); // Fetch only non-expired jobs
    res.status(200).json({
        success: true,
        jobs
    });
});

// Create job
const postJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user; // Get the role of the user from the request

    if (role === "Job Seeker") {
        throw new apiError(400, "Job seeker is not allowed to create jobs"); // Prevent job seekers from creating jobs
    }

    const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

    // Ensure all required job details are provided
    if (!title || !description || !category || !country || !city || !location) {
        throw new apiError(400, "Please provide full job details");
    }
    // Ensure either fixed salary or a salary range is provided
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        throw new apiError(400, "Please either provide a fixed salary or a ranged salary");
    }
    // Prevent providing both fixed salary and salary range
    if (salaryFrom && salaryTo && fixedSalary) {
        throw new apiError(400, "Cannot enter both fixed salary and ranged salary");
    }

    const jobPostedBy = req.user._id; // Set the user ID as the job poster
    const job = await Job.create({
        title,
        description,
        category,
        country,
        city,
        location,
        fixedSalary,
        salaryFrom,
        salaryTo,
        jobPostedBy,
    });

    res.status(200).json({
        success: true,
        message: "Job posted successfully", // Success message for job creation
        job,
    });
});

// Get jobs posted by the logged-in user
const getMyJobs = asyncHandler(async (req, res, next) => {
    const { role } = req.user; // Get the role of the user from the request

    if (role === "Job Seeker") {
        throw new apiError(400, "Job seeker is not allowed to create jobs"); // Prevent job seekers from accessing their jobs
    }

    const myJobs = await Job.find({ jobPostedBy: req.user._id }); // Find jobs posted by the logged-in user

    res.status(200).json({
        success: true,
        myJobs,
    });
});
 
   const updateJob = asyncHandler(async(req,res,next)=>{
        const { role } = req.user; // Get the role of the user from the request

        if (role === "Job Seeker") {
            throw new apiError(400, "Job seeker is not allowed to create jobs"); // Prevent job seekers from accessing their jobs
        }
         const {id} = req.params;
         let job = await Job.findById(id);

         if (!job) {
            throw new apiError(400,"OOps, job not found! ")
         };

         job = await Job.findByIdAndUpdate(id, req.body,{
            new:true,
            runValidators:true,
            useFindAndModify:true,
         })
         res.status(200).json({
            success:true,
            job,
            message:"job Updated successfully"
         });
    })

    // delet jobs
    const deleteJob = asyncHandler(async(req,res,next)=>{
        const { role } = req.user; // Get the role of the user from the request

        if (role === "Job Seeker") {
            throw new apiError(400, "Job seeker is not allowed to create jobs"); // Prevent job seekers from accessing their jobs
        }
         const {id} = req.params;
         let job = await Job.findById(id);

         if (!job) {
            throw new apiError(400,"OOps, job not found! ")
         };

         await Job.deleteOne();
         res.status(200).json({
            success:true,
            message:"job delete successfully",
         })
    })


export { getAllJob, postJob, getMyJobs, updateJob ,deleteJob }; // Export the controller functions
