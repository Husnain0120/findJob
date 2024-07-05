import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";
const dbConnection =async ()=>{
    try {
     const instantConnection  =   await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`);
     console.log(`\n Data Base connected succussfully ${instantConnection.connection.host}`);
    } catch (error) {
        console.log("error connect faild ",error);
        
        process.exit(1)
    }
}

export { dbConnection };