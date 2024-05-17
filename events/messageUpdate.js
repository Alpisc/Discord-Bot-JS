const { Events, EmbedBuilder  } = require('discord.js');

const dotenv = require('dotenv');

dotenv.config();
const { editedLogsChannelId } = process.env;

module.exports = {
	name: Events.MessageUpdate,
	async execute(before, after) {
        if(before.cleanContent == after.cleanContent) return;

        let embed = new EmbedBuilder()
        .setTitle(`Message edited in ${after.channel}`)
        .setTimestamp(after.createdTimestamp)
        .setAuthor({ name: after.author.tag, iconURL: after.author.avatarURL() })
        .setURL(after.url)
        .addFields(
            { name: "Before", value: before.cleanContent, inline: false },
            { name: "After", value: after.cleanContent, inline: false }
        );

        let client = before.client;

		await client.channels.fetch(editedLogsChannelId)
        .then(channel => channel.send({ embeds: [embed] }));
	}
};
