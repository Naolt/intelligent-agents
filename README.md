# AgenticAI

A comprehensive AI agent system built with TypeScript, Express, LangChain and Langgraph.

## Features

- Multiple AI agents for different tasks (restaurant booking, calendar management, event search, hotel booking)
- MCP (Model Context Protocol) server integration
- Firebase integration for push notifications
- Authentication middleware
- Comprehensive logging system

## Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB instance
- Various API keys (see Environment Variables section)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Naolt/intelligent-agents.git
cd intelligent-agents
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill in your actual values in the `.env` file (see Environment Variables section below)

5. Start the development server:
```bash
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and fill in the following variables:

### Required API Keys
- `OPENAI_API_KEY` - Your OpenAI API key
- `GOOGLE_API_KEY` - Your Google API key for Maps and Places
- `FIREBASE_API_KEY` - Your Firebase API key
- `FIREBASE_SDK` - Your Firebase service account JSON (as a string)

### Service URLs
- `CALENDAR_SERVICE_API` - Calendar service endpoint
- `AUTHENTICATION_SERVICE_API` - Authentication service endpoint
- `BUCKET_SERVICE_API` - Bucket service endpoint
- `AI_SERVICE_API` - AI service endpoint

### MCP Server URLs
- `GOOGLE_MAPS_MCP_URL` - Google Maps MCP server URL
- `CALENDAR_TODO_MCP_URL` - Calendar/Todo MCP server URL
- `TICKETMASTER_MCP_URL` - Ticketmaster MCP server URL
- `BROWSER_USE_MCP_URL` - Browser Use MCP server URL
- `PLATINUM_MCP_URL` - Platinum List MCP server URL
- `RATEHAWK_MCP_URL` - RateHawk Hotel MCP server URL
- `AI_CONTAINER_WEBHOOK_URL` - AI container webhook URL

### Database
- `PERSISTENCE_MONGODB_URI` - MongoDB connection string

### Other Services
- `BLIP_API_KEY` - BLIP API key for calling services
- `BLIP_WEBHOOK_SECRET` - BLIP webhook secret
- `HOTEL_API_KEY` - Hotel booking API key
- `TICKET_MASTER_API_KEY` - Ticketmaster API key
- `PLATINUM_LIST_API_KEY` - Platinum List API key

See `.env.example` for the complete list of environment variables.

## Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the TypeScript project
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors

## Project Structure

```
src/
├── agents/           # AI agent implementations
├── config/           # Configuration files
├── controllers/      # Route controllers
├── middlewares/      # Express middlewares
├── mcp-servers/      # MCP server configurations
├── packages/         # Third-party packages
├── repositories/     # Data access layer
├── response/         # Response utilities
├── routes/           # Express routes
├── schemas/          # Validation schemas
├── tools/            # Tool implementations
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Security Notes

- Never commit your `.env` file to version control
- Keep your API keys secure and rotate them regularly
- Use environment variables for all sensitive configuration
- The `.gitignore` file is configured to exclude sensitive files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]
