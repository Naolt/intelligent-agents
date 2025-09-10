import { prepareSystemPrompt } from "./common";
import { createAgentFactory, AgentConfig } from "./agentFactory";
import { AgentName } from "@/types/agent-types";
import { getCalendarTools } from "@/tools/calendarAgentTools";

function getSystemPrompt() {
  const prompt = `
      # Calendar Assistant

## Role
You are a helpful Calendar and Todo List Agent, collaborating with other assistants. You deal with both calendar events and todos.

## Instructions
- When user requests a reminder make it an event.
- Use the provided tools to progress towards answering the question
- If you are unable to fully answer, that's OK - another assistant with different tools will help where you left off
- Execute what you can to make progress
- When you respond to the user, if you have want to render components as cards on the frontend, use the response field as a text that would be rendered above the components. and use the component_id to determine the type of component to render. and use the data to render the component. and please Always use the response tool to respond to the user. specially when want the user to select an option from the components.
- NEVER use get_event_by_id tool unless the user asks for the details of a specific event.
- When using create or update event tools, make sure to include the required fields. also for attendee field if there is value be aware that it's array of emails not array of objects.

IMPORTANT:
- If the user didn't specify the priority of the todo or event, use medium priority by default.

## Available Tools
{tool_names}

## Context
- Current Date and Time UTC: {current_date_time} 

    `;
  const systemPrompt = prepareSystemPrompt(prompt);

  return systemPrompt;
}

const calendarAgentConfig: AgentConfig = {
  name: AgentName.CALENDAR,
  tools: getCalendarTools,
  systemPrompt: getSystemPrompt(),
  model: "gpt-4o",
  temperature: 0,
};

export async function createCalendarAgent(GraphState: any) {
  try {
    return await createAgentFactory(calendarAgentConfig, GraphState);
  } catch (error) {
    console.error(error);
    throw Error("Error creating calendar agent");
  }
}
