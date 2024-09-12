import { Router } from "express";
import userController from "../controller/user-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";

const userRouter = Router();

// sign up user
userRouter.post("/signup", sanitizeRoute, userController.signup);

// login user
userRouter.post("/login", sanitizeRoute, userController.login);

export default userRouter;
