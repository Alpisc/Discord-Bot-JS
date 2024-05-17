const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId } = process.env;

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		let client = member.client;
		await client.channels.fetch(parseInt(welcomeChannelId))
        .then(channel => channel.send(`${member.mention} has left the server. Goodbye!`));
	}
};