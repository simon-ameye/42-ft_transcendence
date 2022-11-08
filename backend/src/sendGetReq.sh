#!/bin/bash

	curl -X GET http://localhost:3001/auth/google2FA/signup -d '{ "email": '$1' }' -H "Content-Type: application/json"
echo ""
