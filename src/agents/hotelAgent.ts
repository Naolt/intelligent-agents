import { getHotelTools } from "@/tools/hotelAgentTools";
import { prepareSystemPrompt } from "./common";
import { createAgentFactory, AgentConfig } from "./agentFactory";
import { AgentName } from "@/types/agent-types";

function getSystemPrompt() {
  const prompt = `
      # Hotel Assistant

## Role
You are a helpful Hotel Agent, collaborating with other assistants.

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

const hotelAgentConfig: AgentConfig = {
  name: AgentName.HOTEL,
  tools: getHotelTools,
  systemPrompt: getSystemPrompt(),
  model: "gpt-4o",
  temperature: 0,
};

export async function createHotelAgent(GraphState: any) {
  try {
    return await createAgentFactory(hotelAgentConfig, GraphState);
  } catch (error) {
    console.error(error);
    throw Error("Error creating hotel agent");
  }
}
