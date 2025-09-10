import { MCP_SERVERS, MCPSERVER_KEY_TYPE } from "@/mcp-servers";
import { MultiServerMCPClient } from "@/packages/mcp-adapters";
import { tool } from "@langchain/core/tools";
import { ZodSchema } from "zod";

const getFinalResponseTool = (schema: ZodSchema) => {
  return tool(async () => {}, {
    name: "Response",
    description: "Always respond to the user using this tool.",
    schema: schema,
  });
};

async function getTools(mcp_server_key: MCPSERVER_KEY_TYPE) {
  try {
    const client = new MultiServerMCPClient(MCP_SERVERS[mcp_server_key]);

    const tools = await client.getTools();
    return tools;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export { getTools, getFinalResponseTool };
