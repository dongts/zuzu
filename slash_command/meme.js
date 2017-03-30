'use strict';

const request = require('request');
const util = require('../util');

const MEME = "https://memegen.link";

function getMemeTemplates(callback) {
    let baseLink = `${MEME}/api/templates/`;
    request(baseLink, (err, resp, body) => {
        if (!err && !resp.body.err) {
            body = JSON.parse(body);
            let templates = {};
            let list = [];
            for (let name in body) {
                let key = body[name].replace(baseLink, '');
                list.push(key);
                templates[key] = name;
            }
            if (callback) callback(null, list, templates);
        } else {
            if (callback) callback(true);
        }
    });
}


function buildUrl(template, top, bottom, alt) {
    return alt ? `${MEME}/${template}/${top || '_'}/${bottom || '_'}.jpg?alt=${alt}` :
        `${MEME}/${template}/${top || '_'}/${bottom || '_'}.jpg`;
}

const execute = function(bot, message, controller) {
    if (message.text === '' || message.text === 'help') {
        bot.replyPrivate(message, 'Post a meme: /meme template_name | top_row | bottom_row\nList meme templates: /meme list');
    } else if (message.text === 'list') {
        getMemeTemplates((err, list, templates) => {
            let helpText = [];
            for (let key in templates) {
                helpText.push(`\`${key}\`: ${templates[key]}`);
            }
            helpText.sort();
            bot.replyPrivate(message, helpText.join('\n'));
        });
    } else {
        let lines = message.text.split('|').map(it => it.trim());
        let [template, top, bottom] = lines;
        [top, bottom] = [top, bottom].map(x => x && encodeURIComponent(x.split(' ').join('_')));
        let alt;
        const templatePromise = new Promise(function(resolve, reject) {
            getMemeTemplates((err, list) => {
                if (!err && list) {
                    if (list.indexOf(template) === -1) {
                        if (template.indexOf('http') === 0) {
                            alt = template;
                            template = "custom";
                            resolve(template);
                            return;
                        } else if (template.indexOf('@') === 0) {
                            let member = template.slice(1);
                            return Promise.resolve(
                                controller.storage.users.get(member, (err, user) => {
                                    if (!err && user && user.profile) {
                                        alt = user.profile.image_512;
                                        template = "custom";
                                        resolve(template);
                                        return;
                                    }
                                })
                            );
                        } else {
                            let random = util.randomInt(0, list.length);
                            if (lines.length === 1) top = template;
                            template = list[random];
                            resolve(template);
                            return;
                        }
                    } else {
                        resolve(template);
                        return;
                    }
                }
                reject();
            });
        });
        templatePromise.then((template) => {
            let meme_url = buildUrl(template, top, bottom, alt);
            let attachments = [{
                image_url: meme_url,
                fallback: [top, bottom].join(' | ')
            }];
            bot.replyPublic(message, {
                attachments: attachments
            });
        }).catch(() => {
            bot.replyPrivate(message, 'Something went wrong!');
        });
    }
}

module.exports = {
    execute
};
