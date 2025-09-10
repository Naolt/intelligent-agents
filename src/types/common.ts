import { z } from "zod";

const component_id_schema = z.enum([
  "todo_card_list",
  "event_card_list",
  "restaurant_card_list",
  "ticket_master_event_card_list",
  "flight_card_list",
  "time_card_list",
  "hotel_card_list",
]);

export type ComponentId = z.infer<typeof component_id_schema>;

// Generic base schema for all agent responses
export function createAgentResponseSchema<T extends z.ZodTypeAny>({
  componentSchema,
}: {
  componentSchema: T;
}) {
  return z
    .object({
      response: z
        .string()
        .describe(
          "The assistant's natural language response to be displayed in the chat interface"
        ),
      components: z
        .array(componentSchema)
        .optional()
        .describe(
          "An optional list of frontend components to render alongside the response"
        ),
    })
    .describe(
      "Structured response from the assistant including both text and UI rendering instructions"
    );
}

export type AgentResponse<T> = {
  response: string;
  components?: Array<{
    component_id: string;
    data: T;
  }>;
};
