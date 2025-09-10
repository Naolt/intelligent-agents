import { Router } from "express";
import { validate } from "../middlewares/validationMiddleware";
import { protectRoute } from "@/middlewares/authMiddleware";
import { aiChatController } from "@/controllers/aiChatController";
import { aiChatSchema } from "../schemas/ai-chat.schema";
import { callModeMiddleware } from "@/middlewares/callModeMiddleware";

const router = Router();

router.post(
  "/ai-chat",
  protectRoute,
  validate(aiChatSchema),
  callModeMiddleware,
  aiChatController
);

export default { path: "/", router };
