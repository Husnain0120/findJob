import {Router} from 'express';
import { getUser, login, logout, register } from '../controllers/user.controllers.js';
import { isAuthorized } from '../middlewares/auth.js';

const userRouters = Router();

userRouters.route("/register").post(register)
userRouters.route("/login").post(login)
userRouters.get("/logout",isAuthorized,logout)
userRouters.get("/getuser",isAuthorized,getUser)

export  {userRouters}
