import { z } from "zod";
import { ChatOpenAI } from "@langchain/openai";
import { tool } from "@langchain/core/tools";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { createSwarm, createHandoffTool } from "@langchain/langgraph-swarm";

const model = new ChatOpenAI({ modelName: "gpt-4o" });

// Create specialized tools
const add = tool(async (args) => args.a + args.b, {
  name: "add",
  description: "Add two numbers.",
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
});

// Create agents with handoff tools
const alice = createReactAgent({
  llm: model,
  tools: [add, createHandoffTool({ agentName: "Bob" })],
  name: "Alice",
  prompt: "You are Alice, an addition expert.",
});

const bob = createReactAgent({
  llm: model,
  tools: [
    createHandoffTool({
      agentName: "Alice",
      description: "Transfer to Alice, she can help with math",
    }),
  ],
  name: "Bob",
  prompt: "You are Bob, you speak like a pirate.",
});

// Create swarm workflow
const checkpointer = new MemorySaver();
const workflow = createSwarm({
  agents: [alice, bob],
  defaultActiveAgent: "Alice",
});

export const app = workflow.compile({
  checkpointer,
});

export const main = async ({
  message,
  threadId,
}: {
  message: string;
  threadId: string;
}) => {
  const config = { configurable: { thread_id: threadId } };
  const finalState = await app.invoke(
    { messages: [{ role: "user", content: message }] },
    config
  );
  return finalState.messages[finalState.messages.length - 1].content as string;
};
