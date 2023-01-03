#!/bin/bash

if [ ! -d "dist" ]; then
    echo "No dist folder found, cancelling"
    exit 1
fi

# If ps -aux | grep Controller.js returns nothing, then the controller is not running
if [ -z "$(ps -aux | grep Controller.js)" ]; then
    echo "Controller is not running, starting it"
    node ./dist/Controller/Controller.js >> logsController.log &
else 
    echo "Controller is already running"
fi