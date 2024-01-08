import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";

export const catchAsyncErrors = (fn: RequestHandler) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(fn(req, res, next)).catch(next);
  };
};
