import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";
import { ApiResponse } from "@/utils/ApiReponse";

export const validate = (schema: AnyZodObject) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        timezone: req.body.timezone,
      });
      next();
    } catch (error) {
      if (error instanceof ZodError) {
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
      next(error);
    }
  };
};
