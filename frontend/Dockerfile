FROM node:22-alpine AS base
WORKDIR /app/frontend
COPY . /app/frontend/

FROM node:22-alpine
WORKDIR /app/frontend
COPY --from=base /app/frontend .
EXPOSE 3000
RUN npm ci
RUN npm run build
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]