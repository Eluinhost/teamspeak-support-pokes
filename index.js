const BotFactory = require('teamspeak-channel-squatter');
const Promise = require('bluebird');
const { intersection } = require('lodash');

const config = require('./config.json');

const notifyGroupIds = config.groupIds.map(id => id.toString());

const sendPokes = (bot, clid) => Promise
    .join(
        bot._send('clientlist', {}, ['groups']).then(clients => {
            clients.forEach(client => {
                // single group is returned as a number
                if (typeof client.client_servergroups === 'number') {
                    client.client_servergroups = [client.client_servergroups.toString()]
                } else {
                    // returned a comma seperated list of numbers
                    client.client_servergroups = client.client_servergroups.split(',');
                }
            });

            return clients
                .filter(it => intersection(notifyGroupIds, it.client_servergroups).length > 0)
                .map(it => it.clid);
        }),
        bot._send('clientinfo', { clid }).then(({ client_nickname }) => config.supportMessage.replace('{{username}}', client_nickname))
    )
    .then(([notifyIds, message]) => Promise.all(notifyIds.map(it => bot.sendMessage(it, message))))
    .then(() => bot.sendPoke(clid, config.acknowledgeMessage));

(new BotFactory())
    .withCredentials(config.username, config.password, config.botname)
    .withAllowedGroups(config.allowedGroupIds)
    .withConnectionInfo(config.address, config.queryport, config.serverport)
    .inChannel(config.channelId)
    .withActions(sendPokes, (bot, clid) => Promise.all([
        bot.kickClient(clid, config.noPermMessage),
        bot.sendPoke(clid, config.noPermMessage)
    ]))
    .build() // Build the bot
    .start() // Start the bot
    .then(() => console.log('Connected!'))
    .catch(err => console.error(err));