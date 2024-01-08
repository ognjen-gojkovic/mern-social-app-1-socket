import { NextFunction, Request, Response } from "express";
import User from "../models/model.user";
import { ErrorHandler } from "../utils/ErrorHandler";

/**
 * @desc
 * register new user
 * @url => /api/auth/register
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, email, password } = req.body;

    console.log(req.body);
    /**
     * @desc
     * check if all fields are provided
     */
    if (!username || !email)
      return next(
        new ErrorHandler("You must provide input to all fields.", 400)
      );
    if (!password || password.length < 8)
      return next(
        new ErrorHandler("Password must be at least 8 characters long.", 400)
      );

    /**
     * @desc
     * check if username already exists
     */
    const usernameExists = await User.findOne({ username });
    if (usernameExists)
      return next(new ErrorHandler("Username already exists!", 400));

    /**
     * @desc
     * check if email already exists
     */
    const emailExists = await User.findOne({ email });
    if (emailExists) return next(new ErrorHandler("User already exists!", 400));

    /**
     * @desc
     * save user to database
     */
    const user = await User.create({
      username,
      email,
      password,
    });
    console.log("user: ", user);
    /**
     * @desc
     * generate access and refresh token
     */
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    /**
     * @desc
     * remove password field from document we will send to frontend
     */

    user.password = undefined;

    /**
     * @desc
     * save refresh token to cookies header
     * on client side in 'fetch' method should be set option 'credentials: "include"'
     * on server side in cors options object should be set 'credentials: true'
     *
     * secure should be enabled when using 'https' protocol
     * when setting cookie-header from cross-origin 'sameSite' property should be 'none'
     * also in browser settings in my case 'Goggle Chrome' in 'security' section
     * should be enabled setting cookies from the third party
     */
    if (user && refreshToken.length > 50)
      res.cookie("refresh_token", refreshToken, {
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

    return res.status(201).json({
      success: true,
      msg: "Registered Successfully.",
      user: user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc
 * login new user
 * @url => /api/auth/login
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    console.log(req.body);
    /**
     * @desc
     * check if all fields are provided
     */
    if (!username) return next(new ErrorHandler("Username is required.", 400));
    if (!password || password.length < 8)
      return next(
        new ErrorHandler("Password must be at least 8 characters long.", 400)
      );

    /**
     * @desc
     * fetch user from database
     * and if don't exist return error
     */
    const user = await User.findOne({ username }).select("+password");
    console.log("server user:", user);
    if (!user)
      return next(
        new ErrorHandler(
          "There is no user with that username.\nYou first must register.",
          400
        )
      );

    /**
     * @desc
     * compare passwords
     * and if there is no match return error
     */
    const isMatch = user.matchPasswords(password);
    if (!isMatch) return next(new ErrorHandler("Invalid Password.", 400));

    /**
     * @desc
     * genenrate access and refresh tokens
     */
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    /**
     * @desc
     * remove password field from document we will send to frontend
     */

    user.password = undefined;

    /**
     * @desc
     * save refresh token to cookies header
     * on client side in 'fetch' method should be set option 'credentials: "include"'
     * on server side in cors options object should be set 'credentials: true'
     *
     * secure should be enabled when using 'https' protocol
     * when setting cookie-header from cross-origin 'sameSite' property should be 'none'
     * also in browser settings in my case 'Goggle Chrome' in 'security' section
     * should be enabled setting cookies from the third party
     */
    if (user && refreshToken.length > 50)
      res.cookie("refresh_token", refreshToken, {
        maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
        httpOnly: true,
        secure: true,
        sameSite: "none",
      });

    return res.status(201).json({
      success: true,
      msg: "Login Successfully.",
      user: user,
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc
 * set Avatar Image
 * @url => /api/auth/setAvatar/:id
 */
export const setAvatar = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(
      userId,
      {
        isAvatarImageSet: true,
        avatarImage,
      },
      {
        new: true,
      }
    );

    return res.status(201).json({
      success: true,
      msg: "Avatar image saved successfully.",
      isSet: userData?.isAvatarImageSet,
      image: userData?.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc
 * get all users
 * @url => /api/auth/allUsers/:id
 */
export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("user id:", req.params);

    const users = await User.find({ _id: { $ne: req.params.id } }).select([
      "email",
      "username",
      "avatarImage",
      "isAvatarImageSet",
      "_id",
    ]);

    return res.status(200).json({
      success: true,
      msg: "Users fetched successfully.",
      users,
    });
  } catch (error) {
    next(error);
  }
};
