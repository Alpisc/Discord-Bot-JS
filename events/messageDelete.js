const { Events, EmbedBuilder  } = require('discord.js');
const { client } = require('../index.js')

const dotenv = require('dotenv');

dotenv.config();
const { deletedLogsChannelId } = process.env;

module.exports = {
	name: Events.MessageUpdate,
	execute(before) {
        let embed = new EmbedBuilder()
        .setTitle(`Message deleted in ${before.channel.mention}`)
        .setTimestamp(after.createdTimestamp)
        .setAuthor(before.author)
        .setURL(after.url)
        .setThumbnail(before.author.avatarURL())
        .addFields(
            { name: "Deleted", value: before.cleanContent, inline: false }
        )
        
		client.channels.fetch(editedLogsChannelId)
        .then(channel => channel.send(embed));
	}
};