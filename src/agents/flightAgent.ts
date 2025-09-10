import { getFlightTools } from "@/tools/flightAgentTools";
import { prepareSystemPrompt } from "./common";
import { AgentConfig, createAgentFactory } from "./agentFactory";
import { AgentName } from "@/types/agent-types";

function getSystemPrompt() {
  const prompt = `
  # Flight Assistant

## Role
You are a helpful Flight Agent, collaborating with other assistants. Use the provided tools to progress towards helping the user. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off.

## Instructions
- Use the provided tools to progress towards helping the user. If you are unable to fully answer, that's OK, another assistant with different tools will help where you left off.
- Execute what you can to make progress
- When you use the flight search tool, you must specify the following required parameters:
  - type: 'one_way' or 'round_trip'
  - origin: airport code (e.g. 'LHR')
  - destination: airport code (e.g. 'JFK')
  - departure_date: date in YYYY-MM-DD format (e.g. '2025-04-24')

- When responding using the flight search tool. prepare the data for the response tool. you can get:
Duffle’s API (offer requests + offers) will give you all this. Look out for:

slices[].segments[] → each leg of the journey

slices[].segments[].departure_at / arrival_at

slices[].segments[].origin.iata_code / destination.iata_code

total_amount + currency

owner.name (the airline)

cabin_class

duration (or compute from timestamps)

passengers[].baggages[] or pricing baggage info per slice/segment

## Available Tools
{tool_names}

## Context
- Current Date and Time UTC: {current_date_time} 

  `;

  const systemPrompt = prepareSystemPrompt(prompt);

  return systemPrompt;
}

const flightAgentConfig: AgentConfig = {
  name: AgentName.FLIGHT,
  tools: getFlightTools,
  systemPrompt: getSystemPrompt(),
  model: "gpt-4o",
  temperature: 0,
};

export async function createFlightAgent(GraphState: any) {
  try {
    return await createAgentFactory(flightAgentConfig, GraphState);
  } catch (error) {
    console.error(error);
    throw Error("Error creating flight agent");
  }
}
