import { MongoClient } from "mongodb";
import { environment } from "./environment";

const client = new MongoClient(environment.COSMOS_ENDPOINT || "");

const persistenceClient = new MongoClient(
  environment.PERSISTENCE_MONGODB_URI || ""
);
async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function getClient() {
  return client;
}

function getPersistenceClient() {
  return persistenceClient;
}

function getDatabase() {
  return client.db(environment.COSMOS_DATABASE || "");
}

export { connect, getClient, getDatabase, getPersistenceClient };
