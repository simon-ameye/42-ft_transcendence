#!/bin/bash

curl -F grant_type=authorization_code \
-F client_id=u-s4t2ud-648c51ea9e1ba58cce46cff68acc6882c3fc4382864770ac7e8f610111a703ec \
-F client_secret=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 \
-F code=cd34c7f85c64f44d10e03beca2736c616ce3b03dc77ceedcb8cd71e165915b56 \
-F state=rRG4hDt6ILWWW5ZYG3CbwuGo \
-F redirect_uri=http://localhost:3000/auth \
-X POST https://api.intra.42.fr/oauth/token
