'use strict';

var Client = require('node-rest-client').Client;

var client = new Client();

const execute = function(bot, message) {
    // direct way
    var datas = message.text.split('|').map(it => it.trim());
    var full_profile = false;
    if (datas.length > 1) {
        full_profile = true;
    }
    var user_tag = datas[0].replace('#', '-');
    var url = 'https://api.lootbox.eu/pc/us/' + user_tag + '/profile';
    client.get(url, function(data, response) {
        // parsed response body as js object
        if (full_profile) {
            bot.replyPublicDelayed(message, '```' + datas[0] + ' - ' + JSON.stringify(data,null,4) + '```');
        } else {
            bot.replyPublicDelayed(message, '```' + data.data.competitive.rank + '```');
        }
    });
}

module.exports = {
    execute
};
