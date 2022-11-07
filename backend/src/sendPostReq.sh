#!/bin/bash

	curl -X POST http://localhost:3000/auth/google2FA/login -d '{ "email": "charlo3@student.42.fr", "code": "151699" }' -H "Content-Type: application/json"
echo ""
