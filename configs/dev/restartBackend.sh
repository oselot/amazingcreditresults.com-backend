#!/bin/bash

killall node
/home/nodejs/backend/node_modules/.bin/forever stopall
cd /home/nodejs/backend
./node_modules/.bin/forever start index.js