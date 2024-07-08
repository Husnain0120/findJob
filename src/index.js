import { app } from "./app.js";
import dotenv from "dotenv"
import { dbConnection } from "./db/index.js";
import { v2 as cloudinary } from 'cloudinary';




dotenv.config({
    path:"./.env"
})

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});


dbConnection()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is runing at PORT: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log(`MONGO_DB CONNNECTION FAILD !!! ${error}`);

})


