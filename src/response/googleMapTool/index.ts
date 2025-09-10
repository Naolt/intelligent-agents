import { RestaurantAgentResponse } from "@/types/restaurant-agent.type";
import { PlacesSearchResponse } from "./type";

const handleGoogleSearchPlacesToolResponse = (
  toolResponse: PlacesSearchResponse
): RestaurantAgentResponse => {
  console.log("Handling Google Search Places Tool Response", toolResponse);

  if (
    !toolResponse ||
    !toolResponse.places ||
    toolResponse.places.length === 0
  ) {
    throw new Error("No Places found in the response");
  }

  return {
    response: "Here are the results for your search",
    components: [
      {
        component_id: "restaurant_card_list",
        data: toolResponse.places.map((place) => ({
          place_id: place.place_id,
          name: place.name,
          businessStatus: place.business_status || "",
          geometry: {
            lat: place.location.lat,
            lng: place.location.lng,
          },
          address: place.formatted_address,
          rating: place.rating,
          photos: place.photos,
          openingHours: place.opening_hours,
          restaurantUrl: place.restaurant_url || "",
        })),
      },
    ],
  };
};

export { handleGoogleSearchPlacesToolResponse };
