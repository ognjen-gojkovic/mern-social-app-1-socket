import { Router } from "express";
import { addMessage, getAllMessages } from "../controllers/controller.messages";
import { catchAsyncErrors } from "../middleware/CatchAsyncError";

export const routerMessage = Router();

routerMessage.route("/addMsg").post(catchAsyncErrors(addMessage));
routerMessage.route("/getMsg").get(catchAsyncErrors(getAllMessages));
