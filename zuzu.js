var Botkit = require('botkit');

const config = require('./config');
const express = require('express');
const bodyParser = require('body-parser');
const RateLimit = require('express-rate-limit');

const limiter = new RateLimit({
    windowMs: 5000, // 1 second
    max: 1, // 1 request/5s
    delayMs: 1000 // 1000s delay each request
});

var controller = Botkit.slackbot({
    debug: false,
    json_file_store: './db_slackbutton_slashcommand/'
        //include "log: false" to disable logging
        //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
}).configureSlackApp({
    clientId: config.client_id,
    clientSecret: config.client_secret,
    scopes: ['users:read','emoji:read','chat:write:bot', 'bot', 'commands'],
});;

// connect the bot to a stream of messages
controller.spawn({
    token: config.api_token,
}).startRTM()

require('./word_catching')(controller);
require('./slash_command/slash_command')(controller);
require('./interactive_message_callback/callback')(controller);

// Setup Express as webserver
var static_dir = __dirname + '/public';
var webserver = express();

webserver.enable('trust proxy'); // For using with Heroku
webserver.use(limiter);
webserver.use(bodyParser.json());
webserver.use(bodyParser.urlencoded({ extended: true }));
webserver.use(express.static(static_dir));

webserver.get('/', (req, res) => { res.send('Hi, I am a bot!'); });

// // Attach webserver to controller
controller.webserver = webserver;
controller.config.port = config.port

controller.createWebhookEndpoints(controller.webserver);

controller.createOauthEndpoints(controller.webserver, function(err, req, res) {
    if (err) {
        res.status(500).send('ERROR: ' + err);
    } else {
        res.send('Success!');
    }
});

webserver.listen(config.port);
