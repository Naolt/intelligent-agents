import winston from "winston";
import morgan from "morgan";

// Create Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json({ space: 2 })
  ),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
    new winston.transports.File({ filename: "logs/info.log", level: "info" }),
  ],
});

logger.add(
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  })
);

// Create Morgan stream
const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

// Create Morgan middleware
export const httpLogger = morgan("combined", { stream });

// Export logger instance
export default logger;
