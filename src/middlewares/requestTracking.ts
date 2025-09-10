import { Request, Response, NextFunction } from "express";
import logger from "@/utils/logger";

export const requestTracking = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Log request
  logger.info("Incoming Request", {
    method: req.method,
    url: req.url,
    query: req.query,
    body: req.body,
    headers: req.headers,
    ip: req.ip,
  });

  // Track response
  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info("Response Sent", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};
