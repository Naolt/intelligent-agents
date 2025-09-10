import { z } from "zod";

// Schema for a restaurant item in the restaurant card component
const CalendarEventSchema = z
  .object({
    _id: z
      .string()
      .optional()
      .describe("Unique identifier for the calendar event"),
    label: z.string().describe("Title or label of the event"),
    description: z.string().describe("Event description"),
    date: z
      .object({
        start: z.string().describe("Start date and time"),
        end: z.string().describe("End date and time"),
      })
      .describe("Event date and time"),
    type: z
      .string()
      .describe("Type of event (e.g., conference, meetup)"),
    priority: z.string().describe("Priority level of the event"),
    tag: z.string().describe("Tag for the event"),
    attendees: z
      .array(
        z.object({
          email: z.string().describe("Required email for attendee"),
          firstName: z.string().describe("First name of attendee"),
          lastName: z.string().describe("Last name of attendee"),
          profilePicture: z.string().describe("Profile picture URL"),
        })
      )
      .describe("List of attendees"),
    location: z.string().describe("Event location"),
    externalAttendees: z
      .array(
        z.object({
          email: z.string().describe("Required email for external attendee"),
          firstName: z
            .string()
            .optional()
            .describe("First name of external attendee"),
          lastName: z
            .string()
            .optional()
            .describe("Last name of external attendee"),
        })
      )
      .optional()
      .describe("List of external attendees"),
    conference_link: z.string().optional().describe("Conference agenda link"),
    media: z.array(z.string()).describe("List of media stringified"),
    image_url: z.string().optional().describe("Image URL for the event"),
    deviceEventId: z.string().optional().describe("Device event ID"),
    deviceCalendarId: z.string().optional().describe("Device calendar ID"),
  })
  .describe(
    "Single calendar event data to be displayed in a calendar component"
  );

const TodoSchema = z
  .object({
    _id: z.string().describe("Unique identifier for the todo"),
    label: z.string().describe("Label of the todo"),
    description: z.string().describe("Description of the todo"),
    priority: z.string().describe("Priority level of the todo"),
    type: z.string().describe("Type of todo"),
    tag: z.string().describe("Tag for the todo"),
    checklist: z
      .array(
        z.object({
          title: z.string().describe("Checklist item title"),
          isCompleted: z
            .boolean()
            .describe("Whether checklist item is completed"),
        })
      )
      .describe("List of checklist items"),
    attendees: z
      .array(
        z.object({
          email: z.string().describe("Required email for attendee"),
          firstName: z.string().describe("First name of attendee"),
          lastName: z.string().describe("Last name of attendee"),
          profilePicture: z.string().describe("Profile picture URL"),
        })
      )
      .describe("List of attendees"),
    externalAttendees: z
      .array(z.string())
      .describe("List of external attendees"),
    media: z.array(z.string()).describe("List of media URLs"),
    isCompleted: z.boolean().describe("Whether the todo is completed"),
  })
  .describe("A single todo item to be displayed in a todo list component");

// Schema for a single UI component to be rendered on the frontend
const ComponentSchema = z
  .object({
    component_id: z.enum(["event_card_list", "todo_card_list"]),
    data: z
      .array(CalendarEventSchema)
      .or(z.array(TodoSchema))
      .describe(
        "List of calendar events or todos to be displayed in the component"
      ),
  })
  .describe("A frontend UI component with associated data");

// The full response schema from the LLM
const CalendarAgentLLMResponseSchema = z
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

export type CalendarAgentResponse = z.infer<
  typeof CalendarAgentLLMResponseSchema
>;

export type EventCard = z.infer<typeof CalendarEventSchema>;
export type TodoCard = z.infer<typeof TodoSchema>;

export { CalendarAgentLLMResponseSchema };
