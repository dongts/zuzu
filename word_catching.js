'use strict';

const config = require('./config');

module.exports = (controller) => {
    // give the bot something to listen for.
    controller.hears('hello', ['direct_message', 'direct_mention', 'mention'], function(bot, message) {

        bot.reply(message, 'Hello yourself.');

    });

    // Save user info
    controller.hears(
        ['update users'],
        'direct_message,direct_mention,mention,message_received',
        (bot, message) => {
            bot.api.users.list({ token: config.api_token },
                (err, response) => {
                    if (!err) {
                        response.members.map((member) => {
                            member.uid = member.id;
                            member.id = member.name;
                            controller.storage.users.save(member);
                        });
                        bot.reply(message, 'Update success!');
                    } else {
                        bot.reply(message, 'Update fail!');
                    }
                });
        }
    );
}
