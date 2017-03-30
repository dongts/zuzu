'use strict';

const config = require('../config');
const voting = require('./voting_callback');

module.exports = (controller) => {
    controller.on('interactive_message_callback', function(bot, message) {
        switch (message.callback_id) {
            case config.CALLBACK_VOTING:
                voting.execute(bot, message, controller);
                break;
            default:
                bot.replyPublic(message, 'I\'m afraid I don\'t know what ' + message.callback_id + ' is.');
                break;

        }
    });
}
