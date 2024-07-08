import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { Application } from '../model/application.model.js';
import { v2 as cloudinary } from 'cloudinary';
import { application } from 'express';
import { Job } from '../model/jobs.model.js';


// Get all applications for an employer
const employerGetAllApplications = asyncHandler(async (req, res, next) => {
    const { role } = req.user;

    // Ensure that only employers can access this route
    if (role === "Job Seeker") {
        throw new apiError(400, "Job Seeker not allowed to see applications.");
    }

    const { _id } = req.user; // Extract the user's ID from the request
    const applications = await Application.find({ 'EmployerID.user': _id }); // Find applications for the employer

    res.status(200).json({
        success: true,
        applications, // Return the applications found
    });
});

// Get all applications for a job seeker
const jobSeekerGetAllApplications = asyncHandler(async (req, res, next) => {
    const { role } = req.user;

    // Ensure that only job seekers can access this route
    if (role === "Employer") {
        throw new apiError(400, "Employer not allowed to see applications.");
    }

    const { _id } = req.user; // Extract the user's ID from the request
    const applications = await Application.find({ 'applicantID.user': _id }); // Find applications for the job seeker

    res.status(200).json({
        success: true,
        applications, // Return the applications found
    });
});

// Delete an application for a job seeker
const jobSeekerDeleteApplication = asyncHandler(async (req, res, next) => {
    const { role } = req.user;

    // Ensure that only job seekers can access this route
    if (role === "Employer") {
        throw new apiError(400, "Employer not allowed to delete applications.");
    }

    const { id } = req.params; // Extract the application ID from the request parameters
    const application = await Application.findById(id); // Find the application by ID

    // Ensure the application exists before attempting to delete
    if (!application) {
        throw new apiError(400, "Oops, application not found");
    }

    await application.deleteOne(); // Delete the application
    res.status(200).json({
        success: true,
        message: "Application deleted successfully!",
    });
});

//postApplication (cloudinary).. .. . ..
const postApplication = asyncHandler(async(req,res,next)=>{
    const { role } = req.user;

    // Ensure that only job seekers can access this route
    if (role === "Employer") {
        throw new apiError(400, "Employer not allowed to delete applications.");
    };

    if (!req.files ||  Object.keys(req.files).length === 0) {
        throw new apiError(400,"resume file is requaired")
    };

    const { resume } = req.files;

    const allowedFormets = ['image/png','image/jpg','image/webp'];

    if (!allowedFormets.includes(resume.mimtype)) {
        throw new apiError(400,"invaild file type please upload your resume in ,png,jpg,webp formats")
    };

    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempfilePath
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("cloudinary Error",cloudinaryResponse.error || "Unknow cloudinary Error");

        return next( new apiError(500,"faild to upload resume"))

    };

    const {name,email,coverLetter,phone,address,jobId}  = req.body
    const applicantID = {
        user:req.user._id,
        role:"Job Seeker"
    };
    if (!jobId) {
        throw new apiError(404,"job not found");
    };
    const jobDetails = await Job.findById(jobId);
    if (!jobDetails) {
        throw new apiError(404,"job not found");
    };

    const employerID = {
        user:jobDetails.postedBy,
        role:"Employer"
    };

    if (!name || !email || !coverLetter || !phone || !address || !applicantID || !employerID || !resume) {
        throw new apiError(400,"please fill all fields")
    };
    const application = await Application.create({
        name , 
        email ,
        coverLetter,
        phone ,
        address ,
        applicantID , 
        employerID,
        resume:{
            public_id:cloudinaryResponse.public_id ,
            url:cloudinaryResponse.secure_url,
        }

    });
    res.status(200).json({
        success:true,
        message:"Application Submited!",
        application,
    });
})


// Export the controller functions
export { 
    employerGetAllApplications,
     jobSeekerGetAllApplications, 
     jobSeekerDeleteApplication,
     postApplication 
    };
