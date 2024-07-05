import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js';
import { apiResponse } from '../utils/ApiResponse.js';
import { User } from '../model/user.model.js';
import { isAuthorized } from '../middlewares/auth.js';
import { sentToken } from '../utils/jwtToken.js';

// Register user
const register = asyncHandler(async (req, res, next) => {
    const { name, email, role, password, phone } = req.body;

    // Validation - not empty
    if (!name || !email || !role || !password || !phone) {
        throw new apiError(400, "All fields are required");
    }

    // Check if user is already registered (email)
    const isEmail = await User.findOne({ email });

    if (isEmail) {
        throw new apiError(409, "User already exists");
    }

    // Create user in db
    const user = await User.create({ name, email, role, password, phone });

    // Remove sensitive fields from the response
    const createUser = await User.findById(user._id).select("-password -phone");

    if (!createUser) {
        throw new apiError(500, "Something went wrong registering the user");
    }

    sentToken(user, 200, res, "User registered successfully!");
});

// Login function
const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        throw new apiError(400, "All fields are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new apiError(400, "Invalid email or password");
    }

    const isPasswordCompared = await user.comparingPassword(password);
    if (!isPasswordCompared) {
        throw new apiError(400, "Invalid email or password");
    }

    if (user.role !== role) {
        throw new apiError(400, "User with this role is not registered");
    }

    sentToken(user, 200, res, "User logged in successfully");
});


//logout

const logout = asyncHandler(async (req, res, next) => {
    res.status(201).cookie("token", "", {
        httpOnly: true,
        expires: new Date(Date.now() - 1000), // Set the expiration date to a point in the past
    }).json({
        success: true,
        message: "User logged out successfully"
    });

  
});


export { register, login,logout };
