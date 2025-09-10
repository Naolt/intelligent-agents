import {
  Annotation,
  MemorySaver,
  MessagesAnnotation,
} from "@langchain/langgraph";
import { createSwarm } from "@langchain/langgraph-swarm";
import { createRestaurantAgent } from "./restaurantAgent";
import { createCalendarAgent } from "./calendarAgent";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { HumanMessage } from "@langchain/core/messages";
import { createEventAgent } from "./eventAgent";
import { User } from "@/types/user.type";
import logger from "@/utils/logger";
import { getClient, getPersistenceClient } from "@/config/database";
import { MongoDBSaver } from "@langchain/langgraph-checkpoint-mongodb";
import { createHotelAgent } from "./hotelAgent";
import { AgentName } from "@/types/agent-types";

export type GraphStateType = {
  messages: (AIMessage | HumanMessage)[];
  activeAgent: string;
  finalResponse: any;
};

async function createAgents() {
  const GraphState = Annotation.Root({
    ...MessagesAnnotation.spec,
    activeAgent: Annotation<string>,
    finalResponse: Annotation<any>,
  });

  try {
    const restaurantAgent = await createRestaurantAgent(GraphState);
    const calendarAgent = await createCalendarAgent(GraphState);
    const eventAgent = await createEventAgent(GraphState);
    const hotelAgent = await createHotelAgent(GraphState);

    // Create swarm workflow
    const workflow = createSwarm({
      agents: [restaurantAgent, calendarAgent, eventAgent, hotelAgent],
      defaultActiveAgent: AgentName.RESTAURANT,
      stateSchema: GraphState,
    });

    let checkpointer = null;
    const useMemory = true;
    if (useMemory) {
      checkpointer = new MemorySaver();
    } else {
      const persistence_client = getPersistenceClient();
      checkpointer = new MongoDBSaver({ client: persistence_client });
    }

    const app = workflow.compile({
      checkpointer,
    });

    return app;
  } catch (error) {
    console.error(error);
    return null;
  }
}

let app: any;

const createOrGetAgentGraph = async () => {
  // Only create a new graph if it doesn't already exist
  if (!app) {
    app = await createAgents();
  }
  // Otherwise, just return the existing one
  return app;
};

createOrGetAgentGraph();

export async function main({
  message,
  threadId,
  user,
  timezone,
}: {
  message: string;
  threadId: string;
  user: User;
  timezone?: string;
}) {
  const app = await createOrGetAgentGraph();

  logger.info("STARTING AGENT", {
    timestamp: new Date().toISOString(),
  });

  const config = {
    configurable: {
      thread_id: threadId,
      recursionLimit: 50,
      //RECURSION_LIMIT_DEFAULT: 10,
    },
  };
  try {
    const finalState = await app.invoke(
      {
        messages: [
          new SystemMessage({
            content: `
            ADDITIONAL CONTEXT:
            - User's information: ${JSON.stringify(user)}
            - User's timezone: ${timezone || "Asia/Dubai"}
            - Thread ID: ${threadId}
            `,
          }),
          new HumanMessage({ content: message }),
        ],
      },
      config
    );

    logger.info("FINAL STATE", {
      timestamp: new Date().toISOString(),
    });

    console.log(JSON.stringify(finalState.finalResponse, null, 2));

    return finalState?.finalResponse || "";
  } catch (error) {
    console.error(error);
    throw new Error("Error invoking agents");
  }
}

export default createAgents;
