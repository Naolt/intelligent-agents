import {
  calendarTodoToolNames,
  CalendarTodoToolType,
} from "./calendarTodoTool/tool-type";
import { GoogleMapTool, googleMapToolNames } from "./googleMapTool/tool-type";
import { PlatinumTool, platinumToolNames } from "./platinumTool/tool-type";
import { RatehawkTool, ratehawkToolNames } from "./ratehawkTool/tool-type";

export type ToolType =
  | CalendarTodoToolType
  | GoogleMapTool
  | PlatinumTool
  | RatehawkTool;

export const toolNames: ToolType[] = [
  ...calendarTodoToolNames,
  ...googleMapToolNames,
  ...platinumToolNames,
  ...ratehawkToolNames,
];
