const Discord = require('discord.js');
const config = require('./config.json');

const client = new Discord.Client();

const format = require('date-fns-tz/format');
const utcToZonedTime = require('date-fns-tz/utcToZonedTime');

let voiceChannel = undefined;
let textChannel = undefined;

client.once('ready', () => {
    console.log('Ready!');

    client.channels.fetch('663505721236652046')
    .then(channel => voiceChannel = channel)
    .catch(console.error);

    client.channels.fetch('763781261386448986')
    .then(channel => textChannel = channel)
    .catch(console.error);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (!voiceChannel || !textChannel) return console.log('Channels not set properly, this is probably an ID error');

    if(oldState.channel === null && newState.channel !== null) {

		if (voiceChannel.members.size >= 2) {

            textChannel.messages.fetch({ limit: 1 })
            .then(messages => {
                const lastMessage = messages.first();
                const currentDate = format(utcToZonedTime(new Date(), 'Europe/Paris'), 'HH:mm dd/MM', { timeZone: 'Europe/Paris' });

                if (!lastMessage)
                    return textChannel.send(`[${currentDate}] @everyone, ${voiceChannel.name} is currently active`);

                if ( ((+new Date) - lastMessage.createdTimestamp) >= (6000) ) {
                    lastMessage.delete({ timeout: 0 })
                    .then(() => textChannel.send(`[${currentDate}] @everyone, ${voiceChannel.name} is currently active`))
                    .catch(console.error);
                }
            })
            .catch(console.error);

        }

    }
});

client.login(config.token);