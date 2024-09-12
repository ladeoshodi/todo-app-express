import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Make a Schema for the structure of the data
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "A username is required"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "An email is required"],
    unique: true,
  },
  password: { type: String, required: [true, "A password is required"] },
});

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

export { User, validatePassword };
