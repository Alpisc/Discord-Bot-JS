const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId } = process.env;

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		const client = member.client;
		const channel = await client.channels.fetch(welcomeChannelId);

		await channel.send(`${member} has left the server. Goodbye!`);
	}
};

