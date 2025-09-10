import { z } from "zod";

export const aiChatSchema = z.object({
  body: z.object({
    message: z.string().min(1, "Message is required"),
    threadId: z.string().min(1, "Thread ID is required"),
    timezone: z.string().optional(),
  }),
});

export type AiChatInput = z.infer<typeof aiChatSchema>["body"];
