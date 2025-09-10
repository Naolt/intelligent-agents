import {
  CalendarAgentResponse,
  EventCard,
  TodoCard,
} from "@/types/calendar-todo-agent.type";
import { GetEventResponse, GetTodoResponse } from "./type";
import { unixToUTC } from "@/utils/dateUtil";
import { tool } from "@langchain/core/tools";

const handleGetEventsToolResponse = (
  toolResponse: GetEventResponse
): CalendarAgentResponse => {


 if (!toolResponse || !toolResponse.data || toolResponse.data.length === 0) {
    throw new Error("No Events found in the response");
  }


  return {
    response: "Here are the events for your search",
    components: [
      {
        component_id: "event_card_list",
        data: toolResponse.data.map(
          (event): EventCard => ({
            _id: event._id,
            label: event.label,
            description: event.description,
            date: {
              start: unixToUTC(event.date.start),
              end: unixToUTC(event.date.end),
            },
            type: event.type,
            location: event.location,
            priority: event.priority,
            tag: event.tag,
            media: event.media,
            attendees: event.attendees,
            externalAttendees: event.externalAttendees,
          })
        ),
      },
    ],
  };
};

const handleGetTodosToolResponse = (
  toolResponse: GetTodoResponse
): CalendarAgentResponse => {

  if (!toolResponse || !toolResponse.data || toolResponse.data.length === 0) {
    throw new Error("No todos found in the response");
  }


  return {
    response: "Here are the todos for your search",
    components: [
      {
        component_id: "todo_card_list",
        data: toolResponse.data.map(
          (todo): TodoCard => ({
            _id: todo._id,
            label: todo.label,
            description: todo.description,
            type: todo.type || "todo",
            priority: todo.priority,
            tag: todo.tag || "",
            media: todo.media,
            attendees: todo.attendees,
            isCompleted: todo.isCompleted,
            externalAttendees: todo.externalAttendees,
            checklist: todo.checklist.map((checklist) => ({
              title: checklist.text,
              isCompleted: checklist.isCompleted,
            })),
          })
        ),
      },
    ],
  };
};

export { handleGetEventsToolResponse, handleGetTodosToolResponse };
