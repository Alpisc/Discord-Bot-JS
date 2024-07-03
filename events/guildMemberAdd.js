require('dotenv').config();
const { Events } = require('discord.js');

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		const client = member.client;
		const channel = await client.channels.fetch(process.env.welcomeChannelId);

		await channel.send(`Welcome to the server ${member}! Make sure to read the ${member.guild.rulesChannel} and have fun!`);
		await member.roles.add(process.env.userRoleId);
	}
};