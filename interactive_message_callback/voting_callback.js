'use strict';

function answer_action(bot, message) {
    console.log(message);
    console.log(message.payload);
    var payload = JSON.parse(message.payload);
    var value = message.actions[0].value;
    var infoMsg = message.user + ' is ' + value;
    var username = payload.user.name;
    var foundExistingLine = false;
    orig.attachments = orig.attachments || [];

    var newAttachments = [];
    var lines = [];

    // look for an existing line/attachment and update it if found
    for (var i = 0; i < orig.attachments.length; i++) {
        var attachment = orig.attachments[i];

        if (attachment.actions) {
            newAttachments.push(attachment);
            continue;
        }

        // parse the attachment text and represent as an object
        var line = new AttachmentLine(attachment.text);
        if (line.answer === value) {
            foundExistingLine = true;
            line.add(username);
        } else if (message.callback_id == 'yes_or_no_callback') {
            line.remove(username);
        }
        if (line.count() > 0) {
            lines.push(line);
        }
    }

    // create a new line if next existing
    if (!foundExistingLine) {
        let line = new AttachmentLine();
        line.answer = value;
        line.add(username);
        lines.push(line);
    }

    // sort lines by most votes
    lines = lines.sort((a, b) => {
        return a.count() > b.count() ? -1 : 1;
    });

    // render and replace the updated attachments list
    orig.attachments = newAttachments.concat(lines.map((l) => {
        return {
            text: l.string(),
            mrkdwn_in: ["text"],
            color: '#00BABE'
        };
    }));
    bot.replyInteractive(message, orig);
}

function recycle_action(bot, message, controller) {
    let myMessage = {
        text: orig.text,
        attachments: orig.attachments,
        channel: message.channel,
        username: 'zuzu' // FIXME: Should set as_user = false
    };
    controller.storage.users.get(config.BOT_BOSS, (err, user) => {
        if (!err && user && user.access_token) {
            bot.config.token = user.access_token;
            bot.send(myMessage, (err, res) => {
                if (!err) {
                    bot.replyInteractive(message, update, (err) => {
                        if (err) {
                            handleError(err, bot, message);
                        }
                    });
                } else {
                    handleError(err, bot, message);
                }
            });
        }
    });
}

function delete_action(bot, message, controller) {
    if (message.user === config.BOT_BOSS) {
        bot.replyInteractive(message, del, (err) => {
            controller.storage.channels.save(lassMessage);
            if (err) {
                handleError(err, bot, message);
            }
        });
    }
}

function handleError(err, bot, message) {

    console.error(err);

    if (!message.response_url) return;

    bot.replyPublicDelayed(message, {
        text: `:scream: Uh Oh: ${err.message || err}`,
        response_type: 'ephemeral',
        replace_original: false
    }, (err) => {
        if (err) console.error('Error handling error:', err);
    });
}


class AttachmentLine {

    constructor(text) {
        this.entries = [];
        this.answer = '';
        if (text) {
            var parts = text.substring(text.indexOf(' ')).split(/»/);
            parts = parts.map((it) => {
                return it.trim();
            });
            this.answer = parts[0];
            this.entries = parts[1].split(',').map((val) => {
                return val.trim();
            });
        }
    }

    add(entry) {
        if (this.entries.indexOf(entry) > -1) {
            this.remove(entry);
        } else {
            this.remove(entry);
            this.entries.push(entry);
        }
        return this;
    }

    remove(entry) {
        this.entries = this.entries.filter((val) => {
            return val && val !== entry;
        });
        return this;
    }

    contains(entry) {
        return this.entries.indexOf(entry) > -1;
    }

    count() {
        return this.entries.length;
    }

    string() {
        let dots = '';
        return '*' + this.count() + '*' + ' ' + this.answer + ' » ' + this.entries.join(', ');
    }
}

const execute = function(bot, message, controller) {
    var orig = message.original_message;
    if (!orig) return;
    var lassMessage = { id: message.channel, original_message: orig };
    var update = {
        text: 'Moved to bottom: ' + orig.text,
        delete_original: true
    };
    var del = {
        text: 'Deleted: ' + orig.text,
        delete_original: true
    };
    switch (message.actions[0].name) {

        case 'answer':
            answer_action(bot, message);
            break;

        case 'recycle':
            recycle_action(bot, message, controller);
            break;

        case 'delete':
            delete_action(bot, message, controller);
            break;

        default:
            return;
    }
}

module.exports = {
    execute
};
