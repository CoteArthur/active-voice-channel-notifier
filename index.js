const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

let voiceChannel = undefined;
let textChannel = undefined;

//TODO handle permissions of textChannel and handle proper voiceChannel fetching

client.once('ready', () => {
    console.log('Ready!');

    // client.channels.fetch('663505721236652046')
    // .then(channel => voiceChannel = channel)
    // .catch(console.error);

    // client.channels.fetch('763781261386448986')
    // .then(channel => textChannel = channel)
    // .catch(console.error);
});

client.on("guildCreate", guild => {
    guild.channels.create('bot-notifications')
    .then(channel => {
        textChannel = channel;
        textChannel.send('beep boop');
    })
    .catch(console.error);
})

client.on('voiceStateUpdate', (oldState, newState) => {
    if (!voiceChannel || !textChannel) return console.log('Channels not set properly');

    if(oldState.channel === null && newState.channel !== null) {

		if (voiceChannel.members.size >= 2) {

            textChannel.messages.fetch({ limit: 1 })
            .then(messages => {
                if (!messages.first())
                    return textChannel.send(`[@everyone] ${voiceChannel.name} is currently active`);
            })
            .catch(console.error);

        }

    }

    if(oldState.channel !== null && newState.channel === null) {

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

client.login(config.token);