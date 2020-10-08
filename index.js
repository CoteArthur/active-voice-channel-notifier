const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});


client.on('message', message => {
	if (message.content === 'a') {
        const voiceChannel = client.channels.cache.get('663505721236652046');

		if (!voiceChannel) {
			return message.reply('please join a voice channel first!');
        }
        
        message.channel.send(`${voiceChannel.members.size}`);
    }

	if (message.content === '!join') {
        if (!message.member.voice.channel) {
            return message.reply('please join a voice channel first!');
        }
        message.member.voice.channel.join();
    }

	if (message.content === '!leave') {
        message.member.voice.channel.leave();
    }
});

client.login('NzYzNTA4ODk1NTY5Njc0Mjkx.X34vEg.aMpcatg0x226kM3KqyY6hEKtJ2M');