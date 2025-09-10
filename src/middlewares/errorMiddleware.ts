import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { HttpException } from "../types/error";
import { ZodError } from "zod";
import logger from "@/utils/logger";
import { ApiResponse } from "@/types/api-response.types";

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof HttpException) {
    logger.error("HTTP Exception", {
      status: error.status,
      message: error.message,
      path: req.path,
      method: req.method,
    });
    ApiResponse.error(res, error.message, error.status);
    return;
  }

  if (error instanceof ZodError) {
    logger.warn("Validation Error", {
      errors: error.errors,
      path: req.path,
      method: req.method,
    });
    ApiResponse.badRequest(
      res,
      "Validation Error",
      error.errors.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      }))
    );
    return;
  }

  // Log unexpected errors
  logger.error("Unexpected Error", {
    error: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  ApiResponse.error(res, "Internal Server Error", 500);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.warn("Not Found", {
    path: req.path,
    method: req.method,
  });
  ApiResponse.notFound(res, `Cannot ${req.method} ${req.path}`);
};
