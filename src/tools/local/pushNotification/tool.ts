import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { sendPushNotification } from "./api";

const sendPushNotificationSchema = z.object({
  user: z.object({
    id: z.string().describe("The id of the user"),
  }),
  message: z.object({
    title: z.string().describe("The title of the push notification"),
    body: z.string().describe("The body of the push notification"),
  }),
});

export type PushNotificationParams = z.infer<typeof sendPushNotificationSchema>;

const sendPushNotificationTool = tool(sendPushNotification, {
  name: "sendPushNotification",
  description: "Send a push notification to a user",
  schema: sendPushNotificationSchema,
});

export { sendPushNotificationTool };
