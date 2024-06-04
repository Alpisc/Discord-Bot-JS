require('dotenv').config();
const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		const client = member.client;
		const channel = await client.channels.fetch(process.env.welcomeChannelId);

		await channel.send(`${member} has left the server. Goodbye!`);
	}
};

