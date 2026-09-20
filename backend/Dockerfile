FROM node:18-alpine

# Install Java runtime (required to run serverless-dynamodb-local binaries)
RUN apk update && apk add --no-cache openjdk11-jre bash

WORKDIR /usr/src/app

COPY package*.json ./

# Ensure development dependencies are fully available for the serverless CLI layer
RUN npm ci

# Leverage Docker Caching: Download & install the standalone DynamoDB Local binaries
# BEFORE copying application files. This avoids re-downloading on code changes.
RUN npx serverless dynamodb install

# Copy the rest of the application files
COPY . .

# Expose API Gateway Emulation (3000) and DynamoDB Local (8000) ports
EXPOSE 3000
EXPOSE 8000

CMD ["npm", "run", "start:local"]
