import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
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
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new apiError(400, "Job seeker is not allowed to create jobs"));
    }

    const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

    if (!title || !description || !category || !country || !city || !location) {
        return next(new apiError(400, "Please provide full job details"));
    }
    
    if ((!salaryFrom || !salaryTo) && !fixedSalary) {
        return next(new apiError(400, "Please either provide a fixed salary or a ranged salary"));
    }
    
    if (salaryFrom && salaryTo && fixedSalary) {
        return next(new apiError(400, "Cannot enter both fixed salary and ranged salary"));
    }

    const jobPostedBy = req.user._id;
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
        message: "Job posted successfully",
        job,
    });
});

// Get jobs posted by the logged-in user
const getMyJobs = asyncHandler(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new apiError(400, "Job seeker is not allowed to create jobs"));
    }

    const myJobs = await Job.find({ jobPostedBy: req.user._id });

    res.status(200).json({
        success: true,
        myJobs,
    });
});

// Update job
const updateJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new apiError(400, "Job seeker is not allowed to update jobs"));
    }

    const { id } = req.params;
    let job = await Job.findById(id);

    if (!job) {
        return next(new apiError(404, "Job not found"));
    }

    job = await Job.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        job,
        message: "Job updated successfully"
    });
});

// Delete job
const deleteJob = asyncHandler(async (req, res, next) => {
    const { role } = req.user;

    if (role === "Job Seeker") {
        return next(new apiError(400, "Job seeker is not allowed to delete jobs"));
    }

    const { id } = req.params;
    let job = await Job.findById(id);

    if (!job) {
        return next(new apiError(404, "Job not found"));
    }

    await Job.deleteOne({ _id: id });

    res.status(200).json({
        success: true,
        message: "Job deleted successfully",
    });
});

// Get single job
const getSingleJob = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    try {
        const job = await Job.findById(id);
        if (!job) {
            return next(new apiError(404, "Job not found"));
        }
        res.status(200).json({
            success: true,
            job
        });
    } catch (error) {
        return next(new apiError(400, "Invalid ID/Cast Error"));
    }
});

export { getAllJob, postJob, getMyJobs, getSingleJob, updateJob, deleteJob };
