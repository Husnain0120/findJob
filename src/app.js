import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

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




export {app}