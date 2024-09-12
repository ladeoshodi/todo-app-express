import { Router } from "express";
import userController from "../controller/user-controller";

const userRouter = Router();

// sign up user
userRouter.post("/signup", userController.signup);

// login user
userRouter.post("/login", userController.login);

export default userRouter;
