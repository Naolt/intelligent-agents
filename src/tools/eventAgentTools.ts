import { getFinalResponseTool, getTools } from "./common";
import { EventAgentLLMResponseSchema } from "@/types/event-agent.type";
import { getHandoffTools } from "./handOffTools";
import { MCPSERVER_KEY } from "@/mcp-servers";
import { AgentName } from "@/types/agent-types";

const getEventTools = async () => {
  const finalResponseTool = getFinalResponseTool(EventAgentLLMResponseSchema);
  const tools = await getTools(MCPSERVER_KEY.EVENT_MCP);
  tools.push(finalResponseTool);

  const handoffTools = getHandoffTools({ exclude: [AgentName.EVENT] });
  tools.push(...handoffTools);

  return tools;
};

export { getEventTools };
