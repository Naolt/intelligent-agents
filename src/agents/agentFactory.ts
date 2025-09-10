import { ChatOpenAI } from "@langchain/openai";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { Command, StateGraph } from "@langchain/langgraph";
import { MessagesPlaceholder, PromptTemplate } from "@langchain/core/prompts";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableConfig } from "@langchain/core/runnables";
import { getCurrentDateAndTime } from "@/utils/dateUtil";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { handleResponse } from "@/response";
import logger from "@/utils/logger";
import { ToolMessage } from "@langchain/core/messages";
import { toolResponseHandlers } from "@/response";
import { ToolType } from "@/response/tool-type";
import { GraphStateType } from "./index";
import { AgentName, NodeName } from "@/types/agent-types";

export interface AgentConfig {
  name: AgentName; // Now type-safe!
  tools: () => Promise<any[]>;
  systemPrompt: string;
  model?: string;
  temperature?: number;
  additionalPromptVariables?: Record<string, any>;
}

export async function createAgentFactory(
  agentConfig: AgentConfig,
  GraphState: any
) {
  const model = new ChatOpenAI({
    model: agentConfig.model || "gpt-4o",
    temperature: agentConfig.temperature || 0,
    apiKey: process.env.OPENAI_API_KEY,
    verbose: true,
  }).bindTools(await agentConfig.tools());

  const tools = await agentConfig.tools();
  const toolNode = new ToolNode<GraphStateType>(tools);

  async function callModel(state: GraphStateType, config: RunnableConfig) {
    logger.info("2. CALLING MODEL", {
      timestamp: new Date().toISOString(),
    });

    const lastMessage = state.messages[
      state.messages.length - 1
    ] as ToolMessage;

    if (
      lastMessage?.tool_call_id &&
      lastMessage.name &&
      toolResponseHandlers[lastMessage.name as ToolType]
    ) {
      const toolName = lastMessage.name;
      const toolResponse = lastMessage.content;
      const response = handleResponse({ toolName, toolResponse });

      if (response !== null) {
        const aiMessage = new AIMessage({
          content: "",
          tool_calls: [
            {
              name: "Response",
              args: response,
              id: new Date().getTime().toString(),
            },
          ],
        });

        return { messages: [aiMessage] };
      }
    }

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", agentConfig.systemPrompt],
      new MessagesPlaceholder("messages"),
    ]);

    const formattedPrompt = await prompt.formatMessages({
      messages: state.messages,
      tool_names: tools?.map((tool: { name: string }) => tool.name).join(", "),
      current_date_time: getCurrentDateAndTime(),
      ...agentConfig.additionalPromptVariables,
    });

    const result = await model.invoke(formattedPrompt, config);
    return { messages: [result] };
  }

  const workflow = new StateGraph(GraphState)
    .addNode(NodeName.AGENT, callModel)
    .addNode(NodeName.TOOLS, toolNode)
    .addNode(NodeName.RESPOND, respond)
    .addNode(NodeName.SHOULD_CONTINUE, shouldContinue, {
      ends: [NodeName.TOOLS, NodeName.RESPOND, NodeName.AGENT],
    })
    .addEdge(NodeName.START, NodeName.AGENT)
    .addEdge(NodeName.AGENT, NodeName.SHOULD_CONTINUE)
    .addEdge(NodeName.TOOLS, NodeName.AGENT)
    .addEdge(NodeName.RESPOND, NodeName.END);

  return workflow.compile({
    name: agentConfig.name,
  });
}

async function shouldContinue(
  state: GraphStateType
): Promise<Command<unknown>> {
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  console.log("LAST MESSAGE", lastMessage.content);
  console.log(
    "LAST MESSAGE TOOL CALLS",
    JSON.stringify(lastMessage.tool_calls, null, 2)
  );

  // If there is no function call, then we finish
  if (!lastMessage.tool_calls || lastMessage.tool_calls.length === 0) {
    // The agent should call tool instead of responding directly
    logger.info("NO TOOL CALLS, CALLING AGENT", {
      timestamp: new Date().toISOString(),
    });

    logger.info("Model Tried to respond without tool calls", {
      content: lastMessage.content,
      timestamp: new Date().toISOString(),
    });

    const systemMessage = new SystemMessage({
      content:
        "YOU MUST ALWAYS USE THE RESPONSE TOOL TO RESPOND TO THE USER. Please use the Response tool to respond to the user.",
    });

    const command = new Command({
      goto: NodeName.AGENT,
      update: {
        messages: [systemMessage],
      },
    });

    return command;
  }

  logger.info("TOOL CALLS FOUND, CHECKING TOOL CALL", {
    tool_call: lastMessage.tool_calls[0].name,
    timestamp: new Date().toISOString(),
  });

  // if there is only 1 tool call and it is the response tool call we respond to the user
  if (
    lastMessage.tool_calls.length === 1 &&
    lastMessage.tool_calls[0].name === "Response"
  ) {
    const command = new Command({
      goto: NodeName.RESPOND,
    });

    return command;
  }

  const command = new Command({
    goto: NodeName.TOOLS,
  });

  return command;
}

async function respond(state: GraphStateType) {
  logger.info("3. RESPONDING TO USER", {
    timestamp: new Date().toISOString(),
  });
  const messages = state.messages;
  const lastMessage = messages[messages.length - 1] as AIMessage;

  const response = lastMessage?.tool_calls?.[0]?.args;

  const toolMessage = new ToolMessage({
    content: "Here is your structured response",
    tool_call_id: lastMessage.tool_calls?.[0]?.id || "",
  });

  return { finalResponse: response, messages: [toolMessage] };
}
