import { z } from "zod";

const HotelCardSchema = z.object({
  hid: z.number().optional(),
  name: z.string(),
  rating: z.number(),
  address: z.string(),
  images: z.array(z.string()),
  description: z.array(
    z.object({
      paragraphs: z.array(z.string()),
      title: z.string(),
    })
  ),
  minimum_price: z.string(),
});

const HotelRateCardSchema = z.object({
  room_name: z.string(),
  room_data_trans: z.object({
    bathroom: z.string().nullable(),
    bedding_type: z.string(),
    main_name: z.string(),
    main_room_type: z.string(),
    misc_room_type: z.string(),
  }),
  meal_data: z.object({
    value: z.string(),
    has_breakfast: z.boolean(),
    no_child_meal: z.boolean(),
  }),
  serp_filters: z.array(z.string()),
  legal_info: z
    .object({
      hotel: z.object({
        name: z.string(),
        address: z.string(),
        taxpayer_number: z.string(),
        state_registration_number: z.string(),
        work_time: z.string(),
      }),
    })
    .nullable(),
  amenities_data: z.array(z.string()),
  availability: z.object({
    allotment: z.number(),
    is_low_availability: z.boolean(),
  }),
  daily_prices: z.array(z.string()),
  currency: z.string(),
  search_hash: z.string(),
  match_hash: z.string(),
});

export enum HotelAgentComponentId {
  HotelCardList = "hotel_card_list",
  HotelRateCardList = "hotel_rate_card_list",
}

const ComponentSchema = z.object({
  component_id: z.enum([
    HotelAgentComponentId.HotelCardList,
    HotelAgentComponentId.HotelRateCardList,
  ]),
  data: z.array(HotelCardSchema).or(z.array(HotelRateCardSchema)),
});

export const HotelAgentLLMResponseSchema = z
  .object({
    response: z
      .string()
      .describe(
        "The assistant's natural language response to be displayed in the chat interface"
      ),
    components: z
      .array(ComponentSchema)
      .describe(
        "An optional list of frontend components to render alongside the response"
      ),
  })
  .describe(
    "Structured response from the assistant including both text and UI rendering instructions"
  );

export type HotelAgentResponse = z.infer<typeof HotelAgentLLMResponseSchema>;
export type HotelCard = z.infer<typeof HotelCardSchema>;
export type HotelRateCard = z.infer<typeof HotelRateCardSchema>;
