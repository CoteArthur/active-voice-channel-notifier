const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client({ partials: ['MESSAGE', 'REACTION'] });

let voiceChannel = undefined;
let textChannel = undefined;

const ytChannelId = '771365575418970112';

client.once('ready', () => {
    console.log('Ready!');

    client.channels.fetch('696348112746446851')
    .then(channel => voiceChannel = channel)
    .catch(console.error);

    client.channels.fetch('764493249745649664')
    .then(channel => textChannel = channel)
    .catch(console.error);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (!voiceChannel || !textChannel) return console.log('Channels not set properly');

    if (oldState.channel === null && newState.channel !== null) {
		if (voiceChannel.members.filter(guildMember => !guildMember.user.bot).size >= 2) {

            textChannel.messages.fetch({ limit: 1 })
            .then(messages => {
                if (!messages.first())
                    return textChannel.send(`[@everyone] ${voiceChannel.name} is currently active`);
            })
            .catch(console.error);

        }
    }

    if (oldState.channel !== null && newState.channel === null) {
		if (voiceChannel.members.size < 2) {

            textChannel.messages.fetch({ limit: 1 })
            .then(messages => {
                const lastMessage = messages.first();

                if (lastMessage)
                    lastMessage.delete({ timeout: 0 }).catch(console.error);
            })
            .catch(console.error);

        }
    }
});

client.on('message', (message) => {
    if (message.channel.id === ytChannelId) {
        if (message.type === 'PINS_ADD') 
            return message.delete();

        return message.react('👍')
            .then(() => message.react('👎'))
            .then(() => message.react('⭐'))
            .catch(console.error);
    }
});

client.on('messageReactionAdd', (reaction) => {
    if (reaction.message.channel.id === ytChannelId) {
        if (reaction.partial)
            reaction.fetch().catch((error) => {return console.error(error)});

        if (reaction._emoji.name === '⭐' && reaction.count >= 2 && !reaction.message.pinned)
            return reaction.message.pin();
    }
});

client.on('messageReactionRemove', (reaction) => {
    if (reaction.message.channel.id === ytChannelId) {
        if (reaction.partial)
            reaction.fetch().catch((error) => {return console.error(error)});

        if (reaction._emoji.name === '⭐' && reaction.count < 2 && reaction.message.pinned)
            return reaction.message.unpin();
    }
});

client.login(config.token);