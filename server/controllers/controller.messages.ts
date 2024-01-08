import { NextFunction, Request, Response } from "express";
import Message from "../models/model.message";
import { ErrorHandler } from "../utils/ErrorHandler";

/**
 * @desc
 * add new message to database
 * @url => /api/messages/addMsg
 */
export const addMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("addMsg:", req.body);
    const { from, to, message } = req.body;
    const data = await Message.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });

    console.log("data:", data);
    if (data) {
      return res.status(200).json({
        success: true,
        msg: "Message added successfully.",
      });
    } else {
      return res.status(500).json({
        success: true,
        msg: "Failed to add message to database.",
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc
 * get all messages from current chat
 * @url => /api/messages/getMsg
 */
export const getAllMessages = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.query);
    const { from, to } = req.query;
    const messages = await Message.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    console.log("my messages:", messages);
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message?.text,
      };
    });

    return res.status(200).json({
      success: true,
      msg: "Success.",
      projectMessages,
    });
  } catch (error) {
    next(error);
  }
};
