const { Events } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId, userRoleId, ruleChannelId } = process.env;

module.exports = {
	name: Events.guildMemberAdd,
	execute(member) {
		let client = member.client;
		client.channels.fetch(paresInt(welcomeChannelId))
        .then(channel => channel.send(`Welcome to the server ${member.mention}! Make sure to read the <#${ruleChannelId}> and have fun!`));
        member.roles.add(parseInt(userRoleId));
	}
};