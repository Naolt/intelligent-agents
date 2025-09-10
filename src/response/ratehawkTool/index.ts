import { SearchHotelsByRegionResponse } from "./type";
import {
  HotelAgentComponentId,
  HotelAgentResponse,
  HotelRateCard,
} from "@/types/hotel-agent.type";

const handleSearchHotelsByHotelIdToolResponse = (
  toolResponse: SearchHotelsByRegionResponse
): HotelAgentResponse => {
  if (!toolResponse || !toolResponse || toolResponse.data.hotels.length === 0) {
    throw new Error("No Hotels found in the response");
  }

  return {
    response: "Here are the results for your search",
    components: [
      {
        component_id: HotelAgentComponentId.HotelCardList,
        data: toolResponse.data.hotels.map((hotel) => ({
          hid: hotel.details.hid,
          name: hotel.details.name,
          rating: hotel.details.rating,
          address: hotel.details.address,
          images: hotel.details.images,
          description: hotel.details.description,
          minimum_price: hotel.minimum_price,
        })),
      },
    ],
  };
};

const handleGetHotelRatesToolResponse = (
  toolResponse: HotelRateCard[]
): HotelAgentResponse => {
  if (!toolResponse || toolResponse.length === 0) {
    throw new Error("No Hotel rates found in the response");
  }

  return {
    response: "Here are the results for your search",
    components: [
      {
        component_id: HotelAgentComponentId.HotelRateCardList,
        data: toolResponse,
      },
    ],
  };
};

export {
  handleSearchHotelsByHotelIdToolResponse,
  handleGetHotelRatesToolResponse,
};
