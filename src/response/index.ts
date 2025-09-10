import { AgentResponse } from "@/types/common";
import { handleGoogleSearchPlacesToolResponse } from "./googleMapTool";
import { ToolType } from "./tool-type";
import {
  handleGetEventsToolResponse,
  handleGetTodosToolResponse,
} from "./calendarTodoTool";
import { handleGetPlatinumEventsToolResponse } from "./platinumTool";
import { safeParse } from "@/utils/safeParse";
import { handleSearchHotelsByHotelIdToolResponse } from "./ratehawkTool";
import { handleGetHotelRatesToolResponse } from "./ratehawkTool";

export const toolResponseHandlers: Partial<
  Record<ToolType, (toolResponse: any) => AgentResponse<any>>
> = {
  maps_search_places: handleGoogleSearchPlacesToolResponse,
  get_events: handleGetEventsToolResponse,
  get_todos: handleGetTodosToolResponse,
  get_events_platinum: handleGetPlatinumEventsToolResponse,
  search_hotels_by_region: handleSearchHotelsByHotelIdToolResponse,
  get_hotel_rates: handleGetHotelRatesToolResponse,
};

const handleResponse = ({
  toolName,
  toolResponse,
}: {
  toolName: string;
  toolResponse: any;
}) => {
  const handler = toolResponseHandlers[toolName as ToolType];
  if (!handler) {
    throw new Error(`No handler found for tool: ${toolName}`);
  }

  try {
    const parsedResponse = safeParse(toolResponse);
    const response = handler(parsedResponse);
    return response;
  } catch (e) {
    console.error("Failed to parse tool response:", e);
    return null;
  }
};

export { handleResponse };
