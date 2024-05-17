const { Events, EmbedBuilder  } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { deletedLogsChannelId } = process.env;

module.exports = {
	name: Events.MessageDelete,
	execute(before) {
        let embed = new EmbedBuilder()
        .setTitle(`Message deleted in ${before.channel.mention}`)
        .setTimestamp(after.createdTimestamp)
        .setAuthor(before.author)
        .setURL(after.url)
        .setThumbnail(before.author.avatarURL())
        .addFields(
            { name: "Deleted", value: before.cleanContent, inline: false }
        );
        
        let client = before.client;

		client.channels.fetch(deletedLogsChannelId)
        .then(channel => channel.send(embed));
	}
};