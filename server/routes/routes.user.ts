import { Router } from "express";
import {
  register,
  login,
  setAvatar,
  getAllUsers,
} from "../controllers/controller.user";
import { catchAsyncErrors } from "../middleware/CatchAsyncError";

export const routerAuth = Router();

routerAuth.route("/register").post(catchAsyncErrors(register));
routerAuth.route("/login").post(catchAsyncErrors(login));
routerAuth.route("/setAvatar/:id").post(catchAsyncErrors(setAvatar));
routerAuth.route("/allUsers/:id").get(catchAsyncErrors(getAllUsers));
