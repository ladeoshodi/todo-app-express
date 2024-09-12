import { NextFunction, Request, Response } from "express";
import { User, validatePassword } from "../models/user-model";
import * as EmailValidator from "email-validator";
import jwt from "jsonwebtoken";

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

        res.send(
          `Login successful, welcome ${foundUser.username} \n token: ${token}`
        );
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
      // check that password is compliant
      checkPasswordCompliance(req.body.password, req.body.passwordConfirmation);

      checkValidEmail(req.body.email);

      const newUser = await User.create(req.body);
      res
        .status(201)
        .send(`Sign up successful - Username: ${newUser.username}`);
    } catch (e) {
      if (e instanceof Error) {
        throw { status: 400, message: e.message };
      } else {
        next(e);
      }
    }
  },
};

function checkPasswordCompliance(
  password: string,
  passwordConfirmation: string
): void {
  if (password !== passwordConfirmation) {
    throw {
      status: 400,
      message: "Password mismatched, please check password and try again",
    };
  } else if (password.length < 8) {
    throw {
      status: 400,
      message: "Password must have at least 8 characters",
    };
  } else if (
    !Array.from(password).some((letter) => letter === letter.toUpperCase())
  ) {
    throw {
      status: 400,
      message: "Password must have at least 1 uppercase character",
    };
  } else if (
    !Array.from(password).some((letter) => letter === letter.toLowerCase())
  ) {
    throw {
      status: 400,
      message: "Password must have at least 1 lowercase character",
    };
  } else if (!/[0-9]/.test(password)) {
    throw {
      status: 400,
      message: "Password must have at least 1 number",
    };
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw {
      status: 400,
      message: "Password must have at least 1 special character",
    };
  }
}

function checkValidEmail(email: string): void {
  if (!EmailValidator.validate(email)) {
    throw {
      status: 400,
      message: "Invalid Email format",
    };
  }
}

export default userController;
