import { app } from "./app.js";
import dotenv from "dotenv"
import { dbConnection } from "./db/index.js";


dotenv.config({
    path:"./.env"
})

dbConnection()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log(`Server is runing at PORT: ${process.env.PORT}`);
    })
})
.catch((error)=>{
    console.log(`MONGO_DB CONNNECTION FAILD !!! ${error}`);

})


