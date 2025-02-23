#front-end Dockerefile
FROM node:18-alpine
WORKDIR /app
COPY front-end/package*.json ./
RUN npm install
COPY front-end/ ./
EXPOSE 3000
CMD ["npm", "run", "dev"]