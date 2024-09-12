import { NextFunction, Request, Response } from "express";
import { User, validatePassword } from "../models/user-model";

const userController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
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
        res.send(`Login Successful, welcome ${foundUser.username}`);
      } else {
        throw {
          status: 401,
          message: `Login failed. Bad password`,
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
  signup: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
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
