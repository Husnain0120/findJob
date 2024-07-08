import mongoose,{Schema} from "mongoose";
import validator from "validator";

const applicationsSchema = new Schema(
    {
        name:{
            type:String,
            required:[true,"Please provide your Name:"],
            minLength:[10,"Name must be at least 10 characters long!"],
            maxLength:[60, "Name cannot exceed 60 characters"]
        },
        email:{
            type:String,
            validator:[validator.isEmail,"Please provide a valid email"],
            required:[true,"Please Provide your email!"],

        },
        coverLetter:{
            type:String,
            required:[true,"Please provide a coverLetter"],

        },
        phone:{
            type:Number,
            required:[true,"Provide a Phone Number"],
            
        },
        address:{
            type:String,
            required:[true,"Please Provide your address"],
            
        },
        resume:{
            public_id:{
                type:String,
                required:[true],

            },
            url:{
                type:String,
                required:[true],
            },
        
        },
        applicantID:{
            user:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            role:{
                type:String,
                enum:["job seeker"],
                required:true
            }
        },
        EmployerID:{
            user:{
                type:Schema.Types.ObjectId,
                ref:"User",
                required:true
            },
            role:{
                type:String,
                enum:["Employer"],
                required:true
            }
        }
    },{timestamps:true})


    export const Application  = mongoose.model("Application",applicationsSchema)