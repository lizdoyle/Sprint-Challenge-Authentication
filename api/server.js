const express = require('express');
const session = require('express-session');


const cors = require('cors');
const helmet = require('helmet');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

const sessionConfig = {
    name: 'lizdoyle',
    secret: "backendisthesecret",

    cookie: {
        maxAge: 1000 * 60,
        secure: false,
        httpOnly: true,
    },

    resave: false,
    saveUninitialized: false
};


server.use(helmet());
server.use(cors());
server.use(express.json());

server.use(session(sessionConfig));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', (req, res) => {
    res.json({api: "This is working!"})
});

module.exports = server;
