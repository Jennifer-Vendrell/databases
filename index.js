const Server = require('./server');

const server = new Server();
require(`dotenv`).config();


server.listen();