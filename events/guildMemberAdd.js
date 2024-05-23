const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId, userRoleId, ruleChannelId } = process.env;

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		try {
			const client = member.client;

			await client.channels.fetch(welcomeChannelId)
			.then(channel => channel.send(`Welcome to the server ${member}! Make sure to read the <#${ruleChannelId}> and have fun!`));
			await member.roles.add(userRoleId);
		} catch (error) {
			console.error(error);
		}
	}
};