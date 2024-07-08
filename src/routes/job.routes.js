import {Router} from 'express';
import { deleteJob, getAllJob, getMyJobs, postJob, updateJob } from '../controllers/job.controllres.js';
import {isAuthorized} from '../middlewares/auth.js';


const jobRouter = Router();

jobRouter.route("/getalljob").get(getAllJob);
jobRouter.route("/postjob").post(isAuthorized,postJob);
jobRouter.route("/myjobs").get(isAuthorized,getMyJobs);
jobRouter.route("/updatejob/:id").put(isAuthorized,updateJob);
jobRouter.route("/deletejob/:id").delete(isAuthorized,deleteJob);

export  {jobRouter}
