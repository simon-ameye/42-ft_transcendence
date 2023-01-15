#rm -rf node_modules package-lock.json 
npm install --silent
npm install -g serve
npm run build
serve -s build