FROM node:20

# Install required system dependencies for canvas
RUN apt-get update && apt-get install -y \
  libcairo2-dev \
  libjpeg-dev \
  libpango1.0-dev \
  libgif-dev \
  librsvg2-dev

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Install globally typeorm
RUN npm install -g typeorm

# Bundle app source
COPY . .

# Build the app
RUN npm run build

# Run the app
CMD ["npm", "run", "start-prod"]