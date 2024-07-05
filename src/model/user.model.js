import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Please provide your Name"],
        minLength: [5, "Name must be at least 5 characters long!"],
        maxLength: [10, "Name cannot exceed 10 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
        type: Number,
        required: [true, "Please provide phone number"]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minLength: [5, "Password must be at least 5 characters long"],
        maxLength: [8, "Password cannot exceed 8 characters"]
    },
    role: {
        type: String,
        required: [true, "Please provide your role"],
        enum: ["Job Seeker", "Employer"]
    }
}, { timestamps: true });

// Hash password before saving the user
userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            this.password = await bcrypt.hash(this.password, 10);
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparingPassword = async function (userPassword) {
    return await bcrypt.compare(userPassword, this.password);
};

// Generate access token method
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRE } // Corrected environment variable name
    );
};

export const User = mongoose.model("User", userSchema);
