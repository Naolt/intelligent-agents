import { HotelCard } from "@/types/hotel-agent.type";

interface BaseResponse {
  debug: any;
  status: string;
  error: any;
}

type Hotel = Omit<HotelCard, "minimum_price">;

interface HotelDetails {
  details: Hotel;
  minimum_price: string;
}

export interface SearchHotelsByRegionResponse extends BaseResponse {
  data: {
    hotels: HotelDetails[];
  };
}
