import { z } from "zod";

// Schema for a restaurant item in the restaurant card component
const RestaurantCardSchema = z
  .object({
    place_id: z
      .string()
      .describe("Unique identifier for the place in Google Places"),
    name: z.string().describe("The name of the place or business"),
    businessStatus: z
      .string()
      .describe("The operational status of the business, e.g., 'OPERATIONAL'"),
    rating: z
      .number()
      .optional()
      .describe("Average user rating of the place, e.g., 4.5"),
    geometry: z
      .object({
        lat: z.number().describe("Latitude of the place"),
        lng: z.number().describe("Longitude of the place"),
      })
      .describe("Geographical coordinates of the place"),
    photos: z
      .array(
        z.object({
          height: z.number(),
          width: z.number(),
          photo_reference: z.string(),
        })
      )
      .optional()
      .describe(
        "List of photos of the place, each photo is an object with height, width, and photo_reference"
      ),
    address: z.string().describe("Full formatted address of the place"),
    openingHours: z
      .object({
        open_now: z
          .boolean()
          .describe("Indicates if the place is currently open"),
      })
      .optional()
      .describe("Object containing the current open status"),
  })
  .describe("Single restaurant data to be displayed in a restaurant card");

const BookingCallIdSchema = z
  .object({
    call_id: z.string().describe("The id of the booking call"),
  })
  .describe(
    "A single booking call id to be displayed in a booking call id component"
  );

const BrowserBookingTaskIdSchema = z
  .object({
    task_id: z.string().describe("The id of the browser booking session"),
  })
  .describe(
    "A single browser booking task id to be displayed in a browser booking task id component"
  );

// Schema for a single UI component to be rendered on the frontend
const ComponentSchema = z
  .object({
    component_id: z.enum([
      "restaurant_card_list",
      "booking_call_id",
      "browser_booking_task_id",
    ]),
    data: z
      .array(RestaurantCardSchema)
      .or(BookingCallIdSchema)
      .or(BrowserBookingTaskIdSchema)
      .describe(
        "List of restaurants to be displayed in the component or a single booking call id to be displayed in a booking call id component or a single browser booking task id to be displayed in a browser booking task id component"
      ),
  })
  .describe("A frontend UI component with associated data");

// The full response schema from the LLM
const RestaurantAgentLLMResponseSchema = z
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

export type RestaurantAgentResponse = z.infer<
  typeof RestaurantAgentLLMResponseSchema
>;

export type BookingCallId = z.infer<typeof BookingCallIdSchema>;
export type RestaurantCard = z.infer<typeof RestaurantCardSchema>;

export { RestaurantAgentLLMResponseSchema };
