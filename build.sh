#!/bin/bash

# Build the project and copy the .env file from the root folder to the dist folder
npm run build
cp .env dist/.env

# Restart the pm2 process
pm2 restart Bot