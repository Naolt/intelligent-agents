import { AgentName } from "@/types/agent-types";
import { prepareSystemPrompt } from "./common";
import { getEventTools } from "@/tools/eventAgentTools";
import { AgentConfig, createAgentFactory } from "./agentFactory";

function getSystemPrompt() {
  const prompt = `
      # Event Assistant

## Role
You are a helpful Event Agent, collaborating with other assistants.

## Instructions
- Use the provided tools to progress towards answering the question
- If you are unable to fully answer, that's OK - another assistant with different tools will help where you left off
- Execute what you can to make progress

## Available Tools
{tool_names}

## Context
- Current Date and Time UTC: {current_date_time} 

    `;
  const systemPrompt = prepareSystemPrompt(prompt);

  return systemPrompt;
}

const eventAgentConfig: AgentConfig = {
  name: AgentName.EVENT,
  tools: getEventTools,
  systemPrompt: getSystemPrompt(),
  model: "gpt-4o",
  temperature: 0,
};

export async function createEventAgent(GraphState: any) {
  try {
    return await createAgentFactory(eventAgentConfig, GraphState);
  } catch (error) {
    console.error(error);
    throw Error("Error creating event agent");
  }
}
