'use strict';

const config = require('../config');
const voting = require('./voting');
const meme = require('./meme');
const safeeval = require('./eval');
const ow_profile = require('./ow_profile');

module.exports = (controller) => {
    controller.on('slash_command', function(bot, message) {
        // if (message.token !== config.verify_token) return; // Verify it
        switch (message.command) {
            case config.SLASH_COMMAND_VOTE:
                voting.execute(bot, message, controller);
                break;
            case config.SLASH_COMMAND_MEME:
                meme.execute(bot, message, controller);
                break;
            case config.SLASH_COMMAND_EVAL:
                safeeval.execute(bot, message);
                break;
            case config.SLASH_COMMAND_OW_PROFILE:
                ow_profile.execute(bot, message);
                break;
            default:
                bot.replyPublic(message, 'I\'m afraid I don\'t know how to ' + message.command + ' yet.');
                break;

        }
    });
}
