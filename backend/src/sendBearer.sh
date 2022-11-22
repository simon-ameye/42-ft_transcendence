#!/bin/bash

curl -H "Accept: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJhYnJ1bkBzdHVkZW50LjQyLmZyIiwiaWF0IjoxNjY5MTIzOTQ4fQ.aXZLvzhm4nGU34tT0-W1s16mdBAq57yWTelgV8A3e-A" \
-F socketId=helloooo \
-X PUT http://localhost:3001/user/modifySocketId
echo ""
