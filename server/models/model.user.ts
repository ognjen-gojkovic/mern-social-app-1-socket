import "dotenv/config";
import mongoose, { Model } from "mongoose";
import validator from "validator";
import * as CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface IUser {
  username: string;
  email: string;
  password: string | undefined;
  isAvatarImageSet: boolean;
  avatarImage: string;
  createdAt: Date;
  resetPasswordToken: string;
  resetPasswordExpire: number;
}

interface IUserMethods {
  matchPasswords: (password: string) => boolean;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  generateResetPasswordToken: () => string;
}

type UserModel = Model<IUser, {}, IUserMethods>;

const UserSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
  username: {
    type: String,
    required: [true, "Please enter your name."],
    minlength: [3, "Your name can't have less the 3 characters."],
    maxlength: [30, "Your name can't exceed 30 characters."],
    unique: true,
  },
  email: {
    type: String,
    maxlength: [50, "Your email can't exceed 30 characters."],
    required: [true, "Please enter your email."],
    unique: true,
    validate: [validator.isEmail, "Please enter valid email address."],
  },
  password: {
    type: String,
    required: [true, "Please enter your password."],
    minlength: [8, "Your password must be at least 6 characters long."],
    select: false,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  resetPasswordToken: String,
  resetPasswordExpire: Number,
});

/**
 * @desc
 * hash password
 */
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  //let pass = CryptoJS.enc.Utf8.parse(this.password);
  //let phrase = CryptoJS.enc.Utf8.parse(process.env.PASSWORD_KEY!);
  let pass = this.password!;
  let phrase = process.env.PASSWORD_KEY!;
  console.log("pass:", pass);
  console.log("phrase:", phrase);
  this.password = await CryptoJS.AES.encrypt(pass, phrase).toString();
});

/**
 * @desc
 * validate password
 */
UserSchema.methods.matchPasswords = function (password: string) {
  const DBpassword = CryptoJS.AES.decrypt(
    this.password!,
    process.env.PASSWORD_KEY!
  ).toString(CryptoJS.enc.Utf8);

  if (DBpassword !== password) return false;
  else return true;
};

/**
 * @desc
 * generate access JWT
 */
UserSchema.methods.generateAccessToken = function () {
  console.log("expires:", process.env.JWT_ACCESS_EXPIRE);
  return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_SECRET!, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE,
  });
};

/**
 * @desc
 * generate refresh JWT
 */
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE,
  });
};

/**
 * @desc
 * generate forgot password token
 */
UserSchema.methods.generateResetPasswordToken = function () {
  // generate token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // hash token
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // set expire time
  this.resetPasswordExpire = Date.now() + 5 * 60 * 1000;

  return resetToken;
};

export default mongoose.model<IUser, UserModel>("user", UserSchema);
