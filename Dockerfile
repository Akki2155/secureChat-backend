FROM node:23.1
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
CMD ["npx", "nodemon", "--legacy-watch", "index.js"]

