import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "The name is required"],
  },
  avatar: {
    type: String,
    default: "av-1.png",
  },
  email: {
    type: String,
    unique: true,
    required: [true, "The email is required"],
  },
  password: {
    type: String,
    required: [true, "The password is required"],
  },
});

userSchema.method("comparePassword", function (password: string = ""): boolean {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

interface Iuser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: string;
  comparePassword(password: string): boolean;
}

export const User = model<Iuser>("User", userSchema);
