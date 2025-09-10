import { setCallMode } from "@/repositories/aiCallSettingRepository";
import { AgentResponse } from "@/types/common";
import { ApiResponse } from "@/utils/ApiReponse";
import { NextFunction, RequestHandler, Request, Response } from "express";

const callModeMiddleware: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { message, threadId } = req.body;

  if (message === "/live" || message === "/test") {
    try {
      const newMode = message === "/live" ? "live" : "test";

      // Update the call mode in the database
      await setCallMode({
        sessionId: threadId,
        mode: newMode,
      });

      const response: AgentResponse<any> = {
        response: `Switched to ${newMode} mode - AI will call ${
          newMode === "live" ? "restaurant's" : "your"
        } phone number`,
        components: [],
      };

      console.log(`Call mode set to ${message} for session ${threadId}`);
      ApiResponse.success(res, "Success", response);
    } catch (error) {
      const response: AgentResponse<any> = {
        response: `Failed to set call mode.`,
        components: [],
      };
      console.error("Error setting call mode:", error);
      ApiResponse.success(res, "Success", response);
    }
    return;
  }

  next();
};

export { callModeMiddleware };
