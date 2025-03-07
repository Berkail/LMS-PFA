#back-end Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY back-end/package*.json ./
RUN npm install
COPY back-end/ ./
EXPOSE 3000
CMD ["npm", "run", "start:dev"]