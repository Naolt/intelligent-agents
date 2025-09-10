import { ClientConfig } from "@/packages/mcp-adapters/dist/client";
import { environment } from "../config/environment";
import * as fs from "fs";
import * as path from "path";

enum TransportType {
  HTTP = "http",
  SSE = "sse",
}

type SingleServerMCPConfig = {
  name: string;
  config:
    | {
        transport?: TransportType;
        url: string;
        automaticSSEFallback?: boolean;
        reconnect?: {
          enabled: boolean;
          maxAttempts: number;
          delayMs: number;
        };
      }
    | {
        command: string;
        args: string[];
        type?: "stdio";
        transport?: "stdio";
        env?: Record<string, string>;
        restart?: {
          enabled: boolean;
          maxAttempts: number;
          delayMs: number;
        };
      };
};

// Google Maps mcp server
export const googleMaps: SingleServerMCPConfig = {
  name: "googleMaps",
  config: {
    transport: TransportType.HTTP,
    url: "https://google-maps-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/stream",
    // url: "http://localhost:3000/stream",
    automaticSSEFallback: false,
    reconnect: {
      enabled: true,
      delayMs: 5000,
      maxAttempts: 10,
    },
  },
};

// Todo and Calendar mcp server
export const todoCalendar: SingleServerMCPConfig = {
  name: "calendar-todo",
  config: {
    transport: TransportType.HTTP,
    url: "https://calendar-todo-mcp-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/stream",
    //url: "http://localhost:3001/stream",
    automaticSSEFallback: false,
    reconnect: {
      enabled: true,
      delayMs: 5000,
      maxAttempts: 10,
    },
  },
};

// Ticketmaster mcp server
export const ticketmaster: SingleServerMCPConfig = {
  name: "ticketmaster",
  config: {
    transport: TransportType.SSE,
    //url: "https://ticketmaster-mcp-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/sse",
    url: "http://localhost:3000/sse",
  },
};

export const browserUse: SingleServerMCPConfig = {
  name: "browserUse",
  config: {
    automaticSSEFallback: false,
    transport: TransportType.HTTP,
    url: "https://browser-use-mcp-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/stream",
    reconnect: {
      enabled: true,
      delayMs: 5000,
      maxAttempts: 10,
    },
  },
};

export const platinum_list_events: SingleServerMCPConfig = {
  name: "platinum_list_events",
  config: {
    transport: TransportType.SSE,
    url: "https://platinum-mcp-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/sse",
    //url: "http://localhost:3000/sse",
  },
};

export const rateHawk_hotel: SingleServerMCPConfig = {
  name: "rateHawk_hotel",
  config: {
    transport: TransportType.HTTP,
    url: "https://ratehawk-mcp-container-app.redsky-e0008d3b.uaenorth.azurecontainerapps.io/stream",
    // url: "http://localhost:3000/stream",
  },
};

const mcp_servers: Record<string, ClientConfig> = {
  "restaurant-mcp": {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
    mcpServers: {
      //[time.name]: time.config,
      [googleMaps.name]: googleMaps.config,
      [browserUse.name]: browserUse.config,
      [todoCalendar.name]: todoCalendar.config,

      //[playwright.name]: playwright.config,
    },
  },
  "calendar-mcp": {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
    mcpServers: {
      [todoCalendar.name]: todoCalendar.config,
    },
  },
  "event-mcp": {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
    mcpServers: {
      [platinum_list_events.name]: platinum_list_events.config,
    },
  },
  "hotel-mcp": {
    throwOnLoadError: true,
    prefixToolNameWithServerName: false,
    additionalToolNamePrefix: "",
    mcpServers: {
      [rateHawk_hotel.name]: rateHawk_hotel.config,
    },
  },
};

const initializeServers = async () => {
  for (const server in mcp_servers) {
    const json = JSON.stringify(mcp_servers[server], null, 2);
    await fs.promises.writeFile(
      path.join(process.cwd(), "src/mcp-servers", `${server}.json`),
      json
    );
  }
  console.log("MCP servers files initialized");
};

export { initializeServers, mcp_servers as MCP_SERVERS };
// Export MCP server keys as a TypeScript enum and a type

export enum MCPSERVER_KEY {
  RESTAURANT_MCP = "restaurant-mcp",
  CALENDAR_MCP = "calendar-mcp",
  EVENT_MCP = "event-mcp",
  HOTEL_MCP = "hotel-mcp",
}

export type MCPSERVER_KEY_TYPE = keyof typeof mcp_servers | `${MCPSERVER_KEY}`;
