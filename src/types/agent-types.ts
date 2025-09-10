// Agent Names Enum
export enum AgentName {
  CALENDAR = "calendarAgent",
  RESTAURANT = "restaurantAgent",
  FLIGHT = "flightAgent",
  EVENT = "eventAgent",
  HOTEL = "hotelAgent",
  HOUSE = "houseAgent",
}

// Node Names Enum (for the workflow graph)
export enum NodeName {
  AGENT = "agent",
  TOOLS = "tools",
  RESPOND = "respond",
  SHOULD_CONTINUE = "shouldContinue",
  START = "__start__",
  END = "__end__",
}

// Edge Names Enum (for workflow connections)
export enum EdgeName {
  START_TO_AGENT = "__start__",
  AGENT_TO_SHOULD_CONTINUE = "agent",
  TOOLS_TO_AGENT = "tools",
  RESPOND_TO_END = "respond",
}
