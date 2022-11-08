#!/bin/bash

	curl -X GET http://localhost:3001/auth/google2FA/signup -d '{ "email": "abrun@student.42.fr" }' -H "Content-Type: application/json"
echo ""
