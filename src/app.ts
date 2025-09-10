import express, { Application, ErrorRequestHandler } from "express";
import cors from "cors";
import helmet from "helmet";
import { connect } from "./config/database";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";
import { requestTracking } from "./middlewares/requestTracking";
import { httpLogger } from "./utils/logger";
import userRoutes from "./routes/user.routes";
import aiChatRoutes from "./routes/ai-chat.routes";
import testRoutes from "./routes/test.routes";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(httpLogger);
    this.app.use(requestTracking);
  }

  private initializeRoutes(): void {
    const apiRouter = express.Router();
    apiRouter.use(userRoutes.path, userRoutes.router);
    apiRouter.use(aiChatRoutes.path, aiChatRoutes.router);
    apiRouter.use(testRoutes.path, testRoutes.router);
    this.app.use("/api/v2", apiRouter);
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler as ErrorRequestHandler);
  }

  private async initializeDatabase(): Promise<void> {
    await connect();
  }
}

export default new App().app;
