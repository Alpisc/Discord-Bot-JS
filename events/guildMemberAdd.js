const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId, userRoleId, ruleChannelId } = process.env;

module.exports = {
	name: Events.GuildMemberAdd,
	async execute(member) {
		try {
					let client = member.client;
		await client.channels.fetch(parseInt(welcomeChannelId))
        .then(channel => channel.send(`Welcome to the server ${member}! Make sure to read the <#${ruleChannelId}> and have fun!`));
        member.roles.add(userRoleId);
		} catch (error) {
			console.error(error);
		}
	}
};