'use strict';

// const api_token = 'xoxb-161793462467-5fpxL6j5TLpRJtsKaivAh3RQ'
// const client_id = '160530094112.162535630550';
// const client_secret = '53faa5f700d9a7591ae02c42f137fadd';
// const verification_token = 'fUf1Gd7fkYV773AdLl4cmLfk';
// const port = 8445;

const api_token = process.env.API_TOKEN;
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const verification_token = process.env.VERIFICATION_TOKEN;
const port = process.env.PORT || 8445;

const mongo_uri = process.env.MONGODB_URI || 'mongodb://localhost/susu_demo';
const mongo_storage = require('botkit-storage-mongo')({mongoUri: mongoUri});
const BOT_BOSS = process.env.BOT_BOSS;

const NEWRELIC_KEY = process.env.NEWRELIC_KEY;

const SLASH_COMMAND_VOTE = '/vote'
const SLASH_COMMAND_MEME = '/meme'
const SLASH_COMMAND_EVAL = '/tinh'
const SLASH_COMMAND_OW_PROFILE = '/owprofile'
const SLASH_COMMAND_OW_HERO = '/owhero'

const CALLBACK_VOTING = 'voting_callback'

module.exports = {
    api_token,
    client_id,
    client_secret,
    verification_token,
    port,
    mongo_uri,
    mongo_storage,
    BOT_BOSS,
    NEWRELIC_KEY,
    SLASH_COMMAND_VOTE,
    SLASH_COMMAND_MEME,
    SLASH_COMMAND_EVAL,
    SLASH_COMMAND_OW_PROFILE,
    SLASH_COMMAND_OW_HERO,
    CALLBACK_VOTING
};
