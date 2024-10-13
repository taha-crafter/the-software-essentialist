import { NextFunction, Request, Response } from "express";
import {
  ClassNotFoundException,
  InvalidRequestBodyException,
  StudentNotFoundException,
} from "./exceptions";
import ErrorExceptionType from "./constants";
import { Class } from "@prisma/client";

type ErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => Response;

function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof InvalidRequestBodyException) {
    return res.status(400).json({
      error: ErrorExceptionType.ValidationError,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  if (error instanceof StudentNotFoundException) {
    return res.status(404).json({
      error: ErrorExceptionType.StudentNotFound,
      data: undefined,
      success: false,
      message: error.message,
    });
  }
  if (error instanceof ClassNotFoundException) {
    return res.status(404).json({
      error: ErrorExceptionType.ClassNotFound,
      data: undefined,
      success: false,
      message: error.message,
    });
  }

  return res.status(500).json({
    error: ErrorExceptionType.ServerError,
    data: undefined,
    success: false,
    message: error.message,
  });
}

export { errorHandler, ErrorHandler };
