const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId, userRoleId, ruleChannelId } = process.env;

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const client = member.client;
		const channel = await client.channels.fetch(welcomeChannelId);

		await channel.send(`Welcome to the server ${member}! Make sure to read the <#${ruleChannelId}> and have fun!`);
		await member.roles.add(userRoleId);
	}
};