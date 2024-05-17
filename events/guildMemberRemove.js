const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId } = process.env;

module.exports = {
	name: Events.guildMemberRemove,
	execute(member) {
		let client = member.client;
		client.channels.fetch(parseInt(welcomeChannelId))
        .then(channel => channel.send(`${member.mention} has left the server. Goodbye!`));
	}
};