var Hapi = require('hapi');

var server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 8000
});

server.start();
