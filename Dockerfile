FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies with legacy peer deps to avoid conflicts
RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"] 