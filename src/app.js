import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';

const app = express();

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

//from data settings
app.use(express.json({limit:"16kb"}))

// url data settings
app.use(express.urlencoded({limit:"16kb",extended:true,}))

// store pdf file  public
app.use(express.static("public"))

// handle cookie-Parser 
app.use(cookieParser())

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:'./public/temp',
}))


//routes 

import {userRouters} from './routes/user.routes.js';
import {applictionRouter} from './routes/application.routes.js';
import { jobRouter } from './routes/job.routes.js';


app.use("/api/v1/users",userRouters);
app.use("/api/v1/application",applictionRouter);
app.use("/api/v1/job",jobRouter);




export {app}