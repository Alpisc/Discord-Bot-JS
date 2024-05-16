const { Events, EmbedBuilder  } = require('discord.js');
const { client } = require('../index.js')

const dotenv = require('dotenv');

dotenv.config();
const { editedLogsChannelId } = process.env;

module.exports = {
	name: Events.MessageUpdate,
	execute(before, after) {
        if(before == after) return;

        let embed = new EmbedBuilder()
        .setTitle(`Message edited in ${before.channel.mention}`)
        .setTimestamp(after.createdTimestamp)
        .setAuthor(before.author)
        .setURL(after.url)
        .setThumbnail(before.author.avatarURL())
        .addFields(
            { name: "Before", value: before.cleanContent, inline: false },
            { name: "After", value: after.cleanContent, inline: false }
        );
        
		client.channels.fetch(editedLogsChannelId)
        .then(channel => channel.send(embed));
	}
};