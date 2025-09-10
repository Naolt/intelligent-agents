# Use a stable Node.js version
FROM node:22

# Set the working directory in the container
WORKDIR /app
ENV NODE_ENV=production

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (force only if needed, try without first)
RUN npm install

# Copy the rest of the application
COPY . .

# Ensure .env is in place
COPY .env /app/.env

# Expose the port
EXPOSE 8000

# Start the application
CMD ["npm", "start"]
