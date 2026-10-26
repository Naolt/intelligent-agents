# Intelligent Agents

> Built at Fluid AI (2025), open-sourced with permission.

A multi-agent travel and lifestyle assistant. A user chats with one endpoint, and a swarm of specialised LangGraph agents books restaurants, finds events, searches hotels and manages their calendar, handing the conversation to each other as the request changes.

## How it works

```
Client ──POST /api/v2/ai-chat──▶ Express API (auth, validation, logging)
                                      │
                                      ▼
                         LangGraph swarm (@langchain/langgraph-swarm)
          ┌───────────────┬───────────────┬───────────────┬───────────────┐
          │ Restaurant     │ Calendar       │ Event          │ Hotel          │
          │ agent (default)│ agent          │ agent          │ agent          │
          └──────┬────────┴──────┬────────┴──────┬────────┴──────┬────────┘
                 │  hand-off tools move the active agent between nodes  │
                 ▼                ▼                ▼                ▼
             MCP servers over HTTP (Google Maps, browser automation, calendar/todo,
             Ticketmaster, Platinumlist, RateHawk) + local tools (push notifications,
             AI phone calls via Bland)
```

- **Agents** (`src/agents`): each agent is built by `createAgentFactory` from a system prompt, a model (GPT-4o by default) and its tool set. `createSwarm` wires them together, with the restaurant agent as the entry point.
- **Hand-offs** (`src/tools/handOffTools.ts`): `createHandoffTool` lets any agent pass control to another, so "book dinner, then add it to my calendar" moves from the restaurant agent to the calendar agent in one conversation.
- **Tools** (`src/tools`, `src/mcp-servers`): most tools are loaded from remote MCP servers through `@langchain/mcp-adapters`. A few run locally: Firebase push notifications and outbound phone calls.
- **Structured responses** (`src/response`): tool results for maps, events, hotels and calendar items are turned into typed UI payloads so the client can render cards instead of plain text.
- **Memory**: conversation state is checkpointed per thread, in memory by default or in MongoDB (`@langchain/langgraph-checkpoint-mongodb`).

## Tech stack

TypeScript · Node.js · Express · LangGraph (swarm) · LangChain · OpenAI GPT-4o · Model Context Protocol · MongoDB · Firebase Admin · Zod · Winston · Docker · Azure Container Apps

## Running it

> The MCP servers this API called were Fluid AI's internal services and are no longer running. To use the agents end to end, point `src/mcp-servers/index.ts` at your own MCP servers. Requests are authenticated with a `token` header checked against an `access_tokens` collection in MongoDB.

Requires Node.js 18+ and MongoDB.

```bash
git clone https://github.com/Naolt/intelligent-agents.git
cd intelligent-agents
npm install
cp .env.example .env   # fill in OPENAI_API_KEY, PERSISTENCE_MONGODB_URI and the keys you need
npm run dev            # starts on PORT (default 3000)
```

Send a message:

```bash
curl -X POST http://localhost:3000/api/v2/ai-chat \
  -H "Content-Type: application/json" \
  -H "token: <user token>" \
  -d '{"message": "Find me an Italian restaurant for two tonight", "threadId": "demo-1"}'
```

Other scripts: `npm run build` (TypeScript), `npm run lint`, `npm run inspector` (MCP Inspector).

## Project structure

```
src/
├── agents/        # agent factory, the four agents, swarm setup
├── tools/         # hand-off tools, per-agent tool loaders, local tools
├── mcp-servers/   # MCP server connections
├── response/      # tool result → UI payload handlers
├── controllers/   # chat controller
├── routes/        # /ai-chat, /users, /test
├── middlewares/   # auth, validation, request tracking, errors
├── config/        # environment, database, Firebase
└── packages/      # vendored MCP SDK and adapters
```
