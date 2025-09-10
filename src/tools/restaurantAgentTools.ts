import { tool } from "@langchain/core/tools";
import { getTools } from "./common";
import { RestaurantAgentLLMResponseSchema } from "@/types/restaurant-agent.type";
import { getHandoffTools } from "./handOffTools";
import {
  makeBookingCallTool,
  getCallStatusTool,
} from "./local/blandCallingTool";
import { sendPushNotificationTool } from "./local/pushNotification/tool";
import { MCPSERVER_KEY } from "@/mcp-servers";
import { AgentName } from "@/types/agent-types";

const finalResponseTool = tool(async () => "mocked value", {
  name: "Response",
  description: "Always respond to the user using this tool.",
  schema: RestaurantAgentLLMResponseSchema,
});

const getRestaurantTools = async () => {
  const tools = await getTools(MCPSERVER_KEY.RESTAURANT_MCP);
  tools.push(
    finalResponseTool,
    makeBookingCallTool,
    getCallStatusTool,
    sendPushNotificationTool
  );

  const handoffTools = getHandoffTools({ exclude: [AgentName.RESTAURANT] });
  tools.push(...handoffTools);

  return tools;
};

export { getRestaurantTools };
