'use strict';

const config = require('../config');

const execute = function(bot, message, controller) {
    if (message.text === '' || message.text === 'help') {
        // Display invisible help
        bot.replyPrivate(message, 'Usage: "Going to bar? | Yes | No | What?"');
    } else if (message.text === 'restore') {
        // Restore latest saved message from storage
        controller.storage.channels.get(message.channel, (err, channelData) => {
            if (!err && channelData && channelData.original_message &&
                message.user === config.BOT_BOSS)
                bot.replyPublic(message, channelData.original_message);
            else
                bot.replyPrivate(message, 'What are you doing');
        });
    } else {
        var voting_callback = config.CALLBACK_VOTING;
        // Create new message
        var lines = message.text.split('|').map(it => it.trim());
        var text = lines[0];

        // max 15 answers (3 for buttons, 1 for move to bottom, 15 for each answer)
        if (lines.length > 16) {
            bot.replyPublic(message, `:sob: Sorry, you may only enter 15 options. Here is what you entered: ahem ${message.text}`);
            return;
        }

        // default actions incase the user doesn't specify one
        var actions = [{
            name: 'answer',
            text: 'Có',
            type: 'button',
            value: 'Có',
            style: 'primary'
        }, {
            name: 'answer',
            text: 'Không',
            type: 'button',
            value: 'Không',
            style: 'default'
        }];

        if (lines.length > 1) {
            actions = [];
            for (var i = 1; i < lines.length; i++) {
                var answer = lines[i];
                actions.push({
                    name: 'answer',
                    text: answer,
                    type: 'button',
                    value: answer,
                    style: 'default'
                });
            }
        }

        // split the buttons into blocks of five if there are that many different
        // questions
        let attachments = [];
        actions.forEach((action, num) => {
            let idx = Math.floor(num / 5);
            if (!attachments[idx]) {
                attachments[idx] = {
                    text: '',
                    fallback: message.text,
                    callback_id: voting_callback,
                    color: '#FF749C',
                    actions: []
                };
            }
            attachments[idx].actions.push(action);
        });

        let bottomActions = [{
            name: 'recycle',
            text: ':arrow_down:',
            type: 'button'
        }, {
            name: 'delete',
            text: ':arrows_counterclockwise:',
            type: 'button'
        }];

        // move to the bottom button
        attachments.push({
            text: '',
            fallback: 'move to the bottom',
            callback_id: voting_callback,
            actions: bottomActions
        });

        bot.replyPublic(message, {
            text: text,
            attachments: attachments
        }, (err) => {
            if (err && err.message === 'channel_not_found') {
                bot.replyPrivate(message, 'Sorry, I can not write to a channel or group I am not a part of!');
            }
        });

    }
}

module.exports = {
    execute
};
