#!/bin/bash

	curl -X GET http://localhost:3000/auth/google2FA/signup -d '{ "email": "charlo3@student.42.fr" }' -H "Content-Type: application/json"
echo ""
