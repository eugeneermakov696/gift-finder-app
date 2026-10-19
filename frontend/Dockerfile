FROM node:22-alpine AS base
WORKDIR /app/frontend
COPY . /app/frontend/

FROM node:22-alpine
WORKDIR /app/frontend
COPY --from=base /app/frontend .
# ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=https://backend-test-01cb.up.railway.app
EXPOSE 3000
RUN rm -rf package-lock.json node_modules && npm install
RUN npm run build
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "3000"]