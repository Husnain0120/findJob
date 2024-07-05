import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import { User } from "../model/user.model.js";


export const isAuthorized = asyncHandler(async(req,res,next)=>{
    const {token}  = req.cookies;
    if (!token) {
        throw new apiError(400,"User is not authorized");
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);

    req.user = await User.findById(decoded.id)

    next();
})