const http = require('http');
const app = require('./app');

const port = process.env.PORT || 22;

const server = http.createServer(app);

server.listen(port);

console.log('port: ' + port);