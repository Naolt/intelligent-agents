import { tool } from "@langchain/core/tools";
import { getTools } from "./common";
import { FlightAgentLLMResponseSchema } from "@/types/flight-agent.type";
import { getHandoffTools } from "./handOffTools";
import { AgentName } from "@/types/agent-types";

const finalResponseTool = tool(async () => {}, {
  name: "Response",
  description: "Always respond to the user using this tool.",
  schema: FlightAgentLLMResponseSchema,
});

const getFlightTools = async () => {
  const tools = await getTools("./src/mcp-servers/flight-mcp.json");
  tools.push(finalResponseTool);

  const handoffTools = getHandoffTools({ exclude: [AgentName.FLIGHT] });
  tools.push(...handoffTools);

  return tools;
};

export { getFlightTools };
