const express = require('express');


const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const configMiddleware = require('./config.middleware');

const server = express();

configMiddleware(server);

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', (req, res) => {
    res.json({api: "This is working!"})
});

module.exports = server;
