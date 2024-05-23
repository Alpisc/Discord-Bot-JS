const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId } = process.env;

module.exports = {
	name: Events.GuildMemberRemove,
	async execute(member) {
		try {
			let client = member.client;
			await client.channels.fetch(parseInt(welcomeChannelId))
			.then(channel => channel.send(`${member} has left the server. Goodbye!`));
		} catch (error) {
			console.error(error);
		}
	}
};