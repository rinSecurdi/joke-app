# Use the official Node.js image as a base
FROM node:18 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock files (if using yarn)
COPY package.json ./

# Install dependencies
RUN npm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the React app
RUN npm run build

# Expose the port your app will run on
EXPOSE 3000

# Start the app using Node.js
CMD ["npm", "start"]
