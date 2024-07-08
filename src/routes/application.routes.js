import {Router} from 'express';
import { employerGetAllApplications, jobSeekerGetAllApplications, jobSeekerDeleteApplication, postApplication } from '../controllers/application.controllers.js';
import {isAuthorized} from '../middlewares/auth.js';



const applictionRouter = Router();

applictionRouter.route("/employer/getall").get(isAuthorized,employerGetAllApplications)
applictionRouter.route("/jobseeker/getall").get(isAuthorized,jobSeekerGetAllApplications)
applictionRouter.route("/delete/:id").delete(isAuthorized,jobSeekerDeleteApplication)
applictionRouter.route("/post").post(isAuthorized,postApplication)

export  {applictionRouter}
