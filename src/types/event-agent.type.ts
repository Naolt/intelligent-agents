import { z } from "zod";

// Schema for a restaurant item in the restaurant card component
const TicketMasterEventSchema = z
  .object({
    name: z.string().describe("Name of the event"),
    start: z.string().datetime().describe("Event start date and time"),
    end: z.string().datetime().describe("Event end date and time"),
    city: z.string().describe("City where the event is taking place"),
    country: z.string().describe("Country where the event is taking place"),
    description: z.string().describe("Description of the event"),
    image: z.string().url().describe("URL to the event's main image or banner"),
    price: z.number().describe("Price of the event"),
    timezone: z.string().describe("Timezone of the event"),
    url: z.string().url().describe("URL to the event on Ticketmaster"),
  })
  .describe("Single event data to be displayed in a event card component");

const PlatinumEventSchema = z.object({
  name: z.string().describe("Name of the event"),
  start: z.string().datetime().describe("Event start date and time"),
  end: z.string().datetime().describe("Event end date and time"),
  city: z.string().describe("City where the event is taking place"),
  country: z.string().describe("Country where the event is taking place"),
  description: z.string().describe("Description of the event"),
  image: z.string().url().describe("URL to the event's main image or banner"),
  price: z.string().describe("Price of the event"),
  timezone: z.string().describe("Timezone of the event"),
  url: z.string().url().describe("URL to the event on Platinum"),
});

// Schema for a single UI component to be rendered on the frontend
const ComponentSchema = z
  .object({
    component_id: z.enum([
      "ticket_master_event_card_list",
      "platinum_event_card_list",
    ]),
    data: z
      .array(TicketMasterEventSchema)
      .or(z.array(PlatinumEventSchema))
      .describe("List of events to be displayed in the component"),
  })
  .describe("A frontend UI component with associated data");

// The full response schema from the LLM
const EventAgentLLMResponseSchema = z
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

export type EventAgentResponse = z.infer<typeof EventAgentLLMResponseSchema>;
export type TicketMasterEvent = z.infer<typeof TicketMasterEventSchema>;
export type PlatinumEvent = z.infer<typeof PlatinumEventSchema>;

export { EventAgentLLMResponseSchema };
