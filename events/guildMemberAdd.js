const { Events } = require('discord.js');
const { client } = require('../index.js')

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId, userRoleId } = process.env;

module.exports = {
	name: Events.guildMemberAdd,
	execute(member) {
		client.channels.fetch(welcomeChannelId)
        .then(channel => channel.send(`Welcome to the server ${member.mention}! Make sure to read the ${client.channels.fetch(editedLogsChannelId).mention} and have fun!`));
        member.roles.add(userRoleId);
	}
};