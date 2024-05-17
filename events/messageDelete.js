const { Events, EmbedBuilder  } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { deletedLogsChannelId } = process.env;

module.exports = {
	name: Events.MessageDelete,
	async execute(before) {
        let embed = new EmbedBuilder()
        .setTitle(`Message deleted in #${before.channel.name}`)
        .setURL(before.url)
        .setTimestamp(before.createdTimestamp)
        .setAuthor({ name: before.author.tag, iconURL: before.author.avatarURL() })
        .addFields(
            { name: "Deleted:", value: before.cleanContent || "No content", inline: false }
        );
        
        let client = before.client;

		await client.channels.fetch(deletedLogsChannelId)
        .then(channel => channel.send({ embeds: [embed] }));
	}
};