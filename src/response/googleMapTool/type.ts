interface GoogleMapsResponse {
  status: string;
  error_message?: string;
}

/*

 place_id: place.place_id,
              name: place.name,
              business_status: place.business_status,
              rating: place.rating,
              location: place.geometry.location,
              photos: place.photos,
              formatted_address: place.formatted_address,
              opening_hours: place.opening_hours,
              types: place.types,

*/

interface PlacesSearchResponse extends GoogleMapsResponse {
  places: Array<{
    place_id: string;
    name: string;
    business_status?: string;
    rating?: number;
    location: {
      lat: number;
      lng: number;
    };
    photos?: Array<{ photo_reference: string; height: number; width: number }>;
    formatted_address: string;
    opening_hours?: { open_now: boolean };
    types: string[];
    restaurant_url?: string;
  }>;
}

interface PlaceDetailsResponse extends GoogleMapsResponse {
  result: {
    name: string;
    place_id: string;
    formatted_address: string;
    formatted_phone_number?: string;
    website?: string;
    rating?: number;
    reviews?: Array<{
      author_name: string;
      rating: number;
      text: string;
      time: number;
    }>;
    opening_hours?: {
      weekday_text: string[];
      open_now: boolean;
    };
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
    photos?: Array<{ photo_reference: string; height: number; width: number }>;
    restaurant_url?: string;
  };
}

export type { GoogleMapsResponse, PlacesSearchResponse, PlaceDetailsResponse };
