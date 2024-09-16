import { Router } from "express";
import userController from "../controllers/user-controller";
import sanitizeRoute from "../middleware/sanitizeRoute";

const userRouter = Router();

/**
 * @swagger
 * tags:
 *   name: User Registration
 *   description: User registration API
 */

/**
 * @swagger
 * /user/signup:
 *   post:
 *     summary: Sign up a user
 *     tags: [User Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - passwordConfirmation
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the user (unique)
 *               email:
 *                 type: string
 *                 description: Email of the user (unique)
 *               password:
 *                 type: string
 *                 description: Password of the user (must be a alpha-numeric value with at least one special character and have a min length of 8 characters)
 *               passwordConfirmation: same as password
 *     responses:
 *       200:
 *         description: The created user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 */
// sign up user
userRouter.post("/signup", sanitizeRoute, userController.signup);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login a user
 *     tags: [User Registration]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: Email of user
 *              password:
 *                type: string
 *                description: Password of user
 *     responses:
 *       200:
 *         description: The logged in user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Success message
 *                 token:
 *                   type: string
 *                   description: JWT token
 */
// login user
userRouter.post("/login", sanitizeRoute, userController.login);

export default userRouter;
