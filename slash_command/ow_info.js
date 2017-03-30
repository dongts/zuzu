'use strict';

var Client = require('node-rest-client').Client;

var client = new Client();

const execute = function(bot, message) {
    // direct way
    user_tag = message.text.replace('#', '-');
    url = 'https://api.lootbox.eu/pc/us/' + user_tag + '/profile'
    client.get(url, function(data, response) {
        // parsed response body as js object
        console.log(data);
        // raw response
        console.log(response);
        bot.replyPublic(message, `${message.text} = ${result}`);
    });
}

module.exports = {
    execute
};
