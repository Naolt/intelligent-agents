import { createHandoffTool } from "@langchain/langgraph-swarm";
import { AgentName } from "@/types/agent-types";

const calendarHandoffTool = createHandoffTool({
  agentName: AgentName.CALENDAR,
  description:
    "Transfer to calendarAgent, he can help with calendar and todo related questions",
});

const restaurantHandoffTool = createHandoffTool({
  agentName: AgentName.RESTAURANT,
  description:
    "Transfer to restaurantAgent, he can help with restaurant and food related questions",
});

const eventHandoffTool = createHandoffTool({
  agentName: AgentName.EVENT,
  description:
    "Transfer to eventAgent, he can help with event related questions",
});

const hotelHandoffTool = createHandoffTool({
  agentName: AgentName.HOTEL,
  description:
    "Transfer to hotelAgent, he can help with hotel related questions",
});

const allHandoffTools = [
  calendarHandoffTool,
  restaurantHandoffTool,
  eventHandoffTool,
  hotelHandoffTool,
];

const getHandoffTools = ({ exclude = [] }: { exclude?: AgentName[] }) => {
  return allHandoffTools.filter(
    (tool) =>
      !exclude.includes(tool?.metadata?.["__handoff_destination"] as AgentName)
  );
};

export {
  calendarHandoffTool,
  restaurantHandoffTool,
  eventHandoffTool,
  hotelHandoffTool,
  getHandoffTools,
};
