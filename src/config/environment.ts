import dotenv from "dotenv";

dotenv.config();

export const environment = {
  NODE_ENV: process.env.NODE_ENV || "development",

  CALENDAR_SERVICE_API: process.env.calendar_service_api || "",
  AUTHENTICATION_SERVICE_API: process.env.authentication_service_api || "",
  BUCKET_SERVICE_API: process.env.bucket_service_api || "",
  AI_SERVICE_API: process.env.ai_service_api || "",

  API_BASE_URL: process.env.API_BASE_URL || "",
  VECTOR_SEARCH_API: process.env.vectorsearch_service_api || "",
  PLATINUM_LIST_API_KEY: process.env.PLATINUM_LIST_API_KEY || "",
  TICKET_MASTER_API_KEY: process.env.TICKET_MASTER_API_KEY || "",
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || "",
  GOOGLE_PLACES_API_KEY: process.env.GOOGLE_API_KEY || "",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  HOTEL_API_KEY: process.env.HOTEL_API_KEY || "",
  HOTEL_API_KEY_USERNAME: process.env.HOTEL_API_KEY_USERNAME || "",

  BLIP_API_KEY: process.env.BLIP_API_KEY || "",
  BLIP_WEBHOOK_SECRET: process.env.BLIP_WEBHOOK_SECRET || "",
  BLIP_WEBHOOK_URL: process.env.BLIP_WEBHOOK_URL || "",
  BLIP_API_URL: process.env.BLIP_API_URL || "",
  BLIP_ENCRYPTED_KEY: process.env.BLIP_ENCRYPTED_KEY || "",
  BLIP_CALLER_PHONE_NUMBER: process.env.BLIP_CALLER_PHONE_NUMBER || "",

  GOOGLE_API_RADIUS: process.env.GOOGLE_API_RADIUS || "",
  PORT: process.env.PORT || 3000,

  MODEL_NAME: process.env.MODEL_NAME || "",
  API_VERSION: process.env.API_VERSION || "",

  COSMOS_ENDPOINT: process.env.COSMOS_ENDPOINT || "",
  COSMOS_KEY: process.env.COSMOS_KEY || "",
  COSMOS_DATABASE: process.env.COSMOS_DATABASE || "",

  LANGCHAIN_TRACING_V2: process.env.LANGCHAIN_TRACING_V2 || "",
  LANGCHAIN_ENDPOINT: process.env.LANGCHAIN_ENDPOINT || "",
  LANGCHAIN_PROJECT: process.env.LANGCHAIN_PROJECT || "",
  LANGCHAIN_API_KEY: process.env.LANGCHAIN_API_KEY || "",

  FIRECRAWL_API_KEY: process.env.FIRECRAWL_API_KEY || "",
  GOOGLE_APPLICATION_CREDENTIALS:
    process.env.GOOGLE_APPLICATION_CREDENTIALS || "",
  CALENDAR_SERVICE_TOKEN: process.env.CALENDAR_SERVICE_TOKEN || "",
  DUFFEL_API_KEY_LIVE: process.env.DUFFEL_API_KEY_LIVE || "",
  TICKETMASTER_API_KEY: process.env.TICKETMASTER_API_KEY || "",
  PERSISTENCE_MONGODB_URI: process.env.PERSISTENCE_MONGODB_URI || "",
  DEFAULT_PHONE_NUMBER_TO_CALL: process.env.DEFAULT_PHONE_NUMBER_TO_CALL || "",
  FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  FIREBASE_SDK: process.env.FIREBASE_SDK,
};
