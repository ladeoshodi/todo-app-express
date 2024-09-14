import { NextFunction, Request, Response } from "express";
import { User, validatePassword } from "../models/user-model";
import jwt from "jsonwebtoken";

const userController = {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const incomingData = req.body;
      const incomingPassword = req.body.password;
      const incomingEmail = req.body.email;

      // check if usr exists
      const foundUser = await User.findOne({ email: incomingEmail });
      if (!foundUser) {
        throw {
          status: 404,
          message: `Login failed. User with email "${incomingEmail}" not found`,
        };
      }
      // compare password
      const isValidPw = validatePassword(incomingPassword, foundUser.password);
      if (isValidPw) {
        // issue unique jwt for the user
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
          throw {
            status: 500,
            message: "JWT_SECRET is not defined in environment variables",
          };
        }

        const token = jwt.sign(
          { userId: foundUser._id, email: foundUser.email },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        res.json({
          message: `Login successful, welcome ${foundUser.username}`,
          token: token,
        });
      } else {
        throw {
          status: 401,
          message: `Login failed. Wrong password/username`,
        };
      }
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.password !== req.body.passwordConfirmation) {
        throw {
          status: 400,
          message: "Password mismatched, please check password and try again",
        };
      }
      const newUser = await User.create(req.body);
      res.status(201).json({
        message: `Sign up successful - Username: ${newUser.username}`,
      });
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
};

export default userController;
