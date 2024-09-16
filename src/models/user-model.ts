import mongoose from "mongoose";
import bcrypt from "bcrypt";
import * as EmailValidator from "email-validator";

// Make a Schema for the structure of the data
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "A username is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "An email is required"],
      unique: true,
      validate: {
        validator: (email: string) => EmailValidator.validate(email),
        message: "Invalid Email format",
      },
    },
    password: {
      type: String,
      required: [true, "A password is required"],
      select: false,
      minLength: [8, "Password must have at least 8 characters"],
      validate: [
        {
          validator: (password: string) => /[A-Z]/.test(password),
          message: "Password must have at least 1 uppercase character",
        },
        {
          validator: (password: string) => /[a-z]/.test(password),
          message: "Password must have at least 1 lowercase character",
        },
        {
          validator: (password: string) => /[0-9]/.test(password),
          message: "Password must have at least 1 number",
        },
        {
          validator: (password: string) =>
            /[!@#$%^&*(),.?":{}|<>]/.test(password),
          message: "Password must have at least 1 special character",
        },
      ],
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
        set: (v: string) => (v === "" ? null : v),
      },
    ],
  },
  { timestamps: true }
);

// hash passwords before mongoose model saves
userSchema.pre("save", function (next) {
  // hash user password
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());

  next();
});

function validatePassword(
  plainPassword: string,
  hashedPassword: string
): boolean {
  return bcrypt.compareSync(plainPassword, hashedPassword);
}

const User = mongoose.model("User", userSchema);

async function initialiseDBIndex() {
  await User.init();
}

initialiseDBIndex();

export { User, validatePassword };
