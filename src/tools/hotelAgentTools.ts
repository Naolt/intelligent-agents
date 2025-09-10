import { getTools } from "./common";
import { MCPSERVER_KEY } from "@/mcp-servers";
import { getFinalResponseTool } from "./common";
import { HotelAgentLLMResponseSchema } from "@/types/hotel-agent.type";
import { getHandoffTools } from "./handOffTools";
import { AgentName } from "@/types/agent-types";

const getHotelTools = async () => {
  const finalResponseTool = getFinalResponseTool(HotelAgentLLMResponseSchema);
  const tools = await getTools(MCPSERVER_KEY.HOTEL_MCP);
  tools.push(finalResponseTool);

  const handoffTools = getHandoffTools({ exclude: [AgentName.HOTEL] });
  tools.push(...handoffTools);

  return tools;
};

export { getHotelTools };
