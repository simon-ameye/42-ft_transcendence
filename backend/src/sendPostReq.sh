#!/bin/bash

	curl -X POST http://localhost:3001/auth/google2FA/login -d '{ "email": '$1', "code": '$2' }' -H "Content-Type: application/json"
echo ""
