import { Request, response, Response } from "express";
import { ApiResponse } from "@/utils/ApiReponse";
import { main } from "@/agents";
import { User } from "@/types/user.type";
import { AgentResponse } from "@/types/common";
import logger from "@/utils/logger";

export const aiChatController = async (req: Request, res: Response) => {
  const { message, threadId, timezone } = req.body;

  const user: User = req.user;

  try {
    const result: AgentResponse<any> = await main({
      message,
      threadId,
      user,
      timezone,
    });
    ApiResponse.success(res, "Success", result);
  } catch (error) {
    ApiResponse.success(res, "Success", {
      response:
        "I apologize, but I'm having trouble understanding or processing your request right now. Could you please rephrase your question or try again in a moment? If the issue persists, there may be a technical problem.",
      components: [],
    });
    logger.error(JSON.stringify(error), {
      message: "Error in aiChatController",
      stack: (error as Error).stack,
    });
  }
};
