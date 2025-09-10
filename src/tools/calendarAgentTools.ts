import { getFinalResponseTool, getTools } from "./common";
import { CalendarAgentLLMResponseSchema } from "@/types/calendar-todo-agent.type";
import { getHandoffTools } from "./handOffTools";
import { MCPSERVER_KEY } from "@/mcp-servers";
import { AgentName } from "@/types/agent-types";

const getCalendarTools = async () => {
  const finalResponseTool = getFinalResponseTool(
    CalendarAgentLLMResponseSchema
  );
  const tools = await getTools(MCPSERVER_KEY.CALENDAR_MCP);
  tools.push(finalResponseTool);

  const handoffTools = getHandoffTools({ exclude: [AgentName.CALENDAR] });
  tools.push(...handoffTools);

  return tools;
};

export { getCalendarTools };
