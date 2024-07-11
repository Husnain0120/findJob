import mongoose, { Schema } from "mongoose";

// Define the job schema with validation rules and comments for each field
const jobSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Please provide job title"],
            minLength: [3, "Minimum title length is 3 letters"],
            maxLength: [20, "Maximum title length is 20 letters"],
        },
        description: {
            type: String,
            required: [true, "Please provide job description"],
            minLength: [20, "Minimum description length is 60 letters"],
            maxLength: [360, "Maximum description length is 360 letters"],
        },
        category: {
            type: String,
            required: [true, "Please provide job category"],
        },
        country: {
            type: String,
            required: [true, "Please provide job country"],
        },
        city: {
            type: String,
            required: [true, "Please provide job city"],
        },
        location: {
            type: String,
            required: [true, "Please provide job location"],
            minLength: [20, "Job location must be at least 30 letters"],
        },
        fixedSalary: {
            type: Number,
            min: [4, "Fixed salary must be at least 4 digits"], // Adjust the min value as needed
            max: [999999999, "Fixed salary cannot exceed 9 digits"], // Adjust the max value as needed
        },
        salaryFrom: {
            type: Number,
            min: [4, "Salary from must be at least 4 digits"], // Adjust the min value as needed
            max: [9, "Salary from cannot exceed 9 digits"], // Adjust the max value as needed
        },
        salaryTo: {
            type: Number,
            min: [4, "Salary to must be at least 4 digits"], // Adjust the min value as needed
            max: [9, "Salary to cannot exceed 9 digits"], // Adjust the max value as needed
        },
        expired: {
            type: Boolean,
            default: false,
        },
        jobPostedOn: {
            type: Date,
            default: Date.now,
        },
        jobPostedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true } // Enable timestamps for createdAt and updatedAt fields
);

// Export the Job model based on the jobSchema
export const Job = mongoose.model("Job", jobSchema);
