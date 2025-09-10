import { environment } from "@/config/environment";
import {
  RestaurantAgentResponse,
  RestaurantCard,
} from "@/types/restaurant-agent.type";
import { z } from "zod";

const GOOGLE_MAPS_API_KEY = environment.GOOGLE_API_KEY;

interface GoogleMapsResponse {
  status: string;
  error_message?: string;
}

interface PlacesSearchResponse extends GoogleMapsResponse {
  results: Array<{
    name: string;
    place_id: string;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    rating?: number;
    types: string[];
    business_status?: string;
    opening_hours?: { open_now: boolean };
    photos?: Array<{ photo_reference: string; height: number; width: number }>;
  }>;
}

const placeSearchInputSchema = z.object({
  query: z.string(),
  location: z
    .object({ latitude: z.number(), longitude: z.number() })
    .optional(),
  radius: z.number().optional(),
});

export type PlaceSearchInput = z.infer<typeof placeSearchInputSchema>;

async function handlePlaceSearch(
  input: PlaceSearchInput
): Promise<RestaurantAgentResponse> {
  const { success, data: parsedInput } =
    placeSearchInputSchema.safeParse(input);

  if (!success) {
    return {
      response: `Invalid input ${JSON.stringify(parsedInput)}`,
      components: [],
    };
  }

  const { query, location, radius } = parsedInput;
  const url = new URL(
    "https://maps.googleapis.com/maps/api/place/textsearch/json"
  );
  url.searchParams.append("query", query);
  url.searchParams.append("key", GOOGLE_MAPS_API_KEY as string);

  if (location) {
    url.searchParams.append(
      "location",
      `${location.latitude},${location.longitude}`
    );
  }
  if (radius) {
    url.searchParams.append("radius", radius.toString());
  }

  const response = await fetch(url.toString());
  const data = (await response.json()) as PlacesSearchResponse;

  if (data.status !== "OK" || data.results.length === 0) {
    const content =
      data.status === "ZERO_RESULTS"
        ? "Sorry, I couldn't find any places"
        : data.error_message || "Sorry,I am having trouble finding places";

    return {
      response: content,
      components: [],
    };
  }

  return {
    response: "Here are the places I found",
    components: [
      {
        component_id: "restaurant_card_list",
        data: data.results.map(
          (place): RestaurantCard => ({
            place_id: place.place_id,
            name: place.name,
            businessStatus: place.business_status || "OPERATIONAL",
            geometry: {
              lat: place.geometry.location.lat,
              lng: place.geometry.location.lng,
            },
            address: place.formatted_address,
            rating: place.rating,
            photos: place.photos,
            openingHours: place.opening_hours,
          })
        ),
      },
    ],
  };
}

export { handlePlaceSearch };
