import { z } from "zod";

// Schema for a flight item in the flight card component
const FlightSchema = z
  .object({
    airlineName: z
      .string()
      .describe("Name of the airline operating the flight"),

    departureAirport: z
      .string()
      .length(3)
      .describe("IATA code of the departure airport (e.g., LAX)"),
    arrivalAirport: z
      .string()
      .length(3)
      .describe("IATA code of the arrival airport (e.g., JFK)"),

    departureTime: z
      .string()
      .datetime()
      .describe("ISO timestamp for flight departure"),
    arrivalTime: z
      .string()
      .datetime()
      .describe("ISO timestamp for flight arrival"),
    duration: z
      .string()
      .describe("Total duration of the flight (e.g., '4h 30m')"),

    stops: z.number().describe("Number of stops (0 for non-stop)"),
    stopoverAirport: z
      .string()
      .length(3)
      .optional()
      .describe("IATA code of the stopover airport, if applicable"),

    cabinClass: z
      .string()
      .describe("Cabin class for this offer (e.g., Economy, Business)"),
    baggage: z
      .string()
      .optional()
      .describe(
        "Baggage info included with this fare (e.g., '1 carry-on, 1 checked')"
      ),

    price: z.number().describe("Total flight price"),
    currency: z.string().length(3).describe("Currency code (e.g., 'USD')"),

    bookingUrl: z.string().url().describe("Link to book the flight"),

    aircraft: z
      .string()
      .optional()
      .describe("Aircraft model (e.g., Boeing 777), optional display"),
    seatAvailability: z
      .string()
      .optional()
      .describe("Optional availability info (e.g., 'Only 2 seats left!')"),
    fareType: z
      .string()
      .optional()
      .describe("Optional fare type (e.g., 'Refundable Economy')"),
  })
  .describe("Single flight data to be displayed in a flight component");

// Schema for a single UI component to be rendered on the frontend
const ComponentSchema = z
  .object({
    component_id: z.enum(["flight_card_list"]),
    data: z
      .array(FlightSchema)
      .describe("List of flights to be displayed in the component"),
  })
  .describe("A frontend UI component with associated data");

// The full response schema from the LLM
const FlightAgentLLMResponseSchema = z
  .object({
    response: z
      .string()
      .describe(
        "The assistant's natural language response to be displayed in the chat interface"
      ),
    components: z
      .array(ComponentSchema)
      .optional()
      .describe(
        "An optional list of frontend components to render alongside the response"
      ),
  })
  .describe(
    "Structured response from the assistant including both text and UI rendering instructions"
  );

export type FlightAgentResponse = z.infer<typeof FlightAgentLLMResponseSchema>;

export { FlightAgentLLMResponseSchema };
