#!/bin/bash

if [ ! -d "dist" ]; then
    echo "No dist folder found, cancelling"
    exit 1
fi

node ./dist/Controller/Controller.js >> logsController.log &