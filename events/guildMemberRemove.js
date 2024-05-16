const { Events } = require('discord.js');
const { client } = require('../index.js')

const dotenv = require('dotenv');

dotenv.config();
const { welcomeChannelId } = process.env;

module.exports = {
	name: Events.guildMemberRemove,
	execute(member) {
		client.channels.fetch(welcomeChannelId)
        .then(channel => channel.send(`${member.mention} has left the server. Goodbye!`));
	}
};