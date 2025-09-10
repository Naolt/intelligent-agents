import { EventAgentResponse } from "@/types/event-agent.type";
import { PlatinumEvent } from "./type";
import { unixToUTC } from "@/utils/dateUtil";

const handleGetPlatinumEventsToolResponse = (
  toolResponse: PlatinumEvent[]
): EventAgentResponse => {
  if (!toolResponse || !toolResponse || toolResponse.length === 0) {
    throw new Error("No Events found in the response");
  }

  return {
    response: "Here are the results for your search",
    components: [
      {
        component_id: "platinum_event_card_list",
        data: toolResponse.map((event) => ({
          name: event.name,
          start: unixToUTC(event.start),
          end: unixToUTC(event.end),
          city: event.city,
          country: event.country,
          price: event.price,
          image: event.image,
          timezone: event.timezone,
          url: event.url,
          description: event.description,
        })),
      },
    ],
  };
};

export { handleGetPlatinumEventsToolResponse };
