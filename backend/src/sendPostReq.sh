#!/bin/bash

	curl -X POST http://localhost:3000/auth/google2FA/verify -d '{"code": "522178"}' -H "Content-Type: application/json"
echo ""
