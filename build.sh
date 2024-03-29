#!/bin/bash

echo "Pulling latest changes from git repository..."

# Pull the latest changes from the git repository
git pull

echo "Installing dependencies..."

# Build the project and copy the .env file from the root folder to the dist folder
npm run build
cp .env dist/.env

# Clear the logs
rm Logs.log
touch Logs.log

echo "Restarting pm2 process..."

# Restart the pm2 process
pm2 restart Kairos

echo "Done!"

# Path: .env
#@Eric-Philippe