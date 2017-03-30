'use strict';
const safeEval = require('safe-eval');

const execute = function(bot, message) {
    let result = message.text;
    try {
        result = safeEval(result);
    } catch (e) {}
    bot.replyPublic(message, `${message.text} = ${result}`);
}

module.exports = {
    execute
};
