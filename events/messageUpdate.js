require('dotenv').config();
const { Events, EmbedBuilder  } = require('discord.js');

module.exports = {
	name: Events.MessageUpdate,
	async execute(before, after) {
        if(before.cleanContent == after.cleanContent) return;

        const embed = new EmbedBuilder()
        .setTitle(`Message edited in ${after.channel}`)
        .setTimestamp(after.createdTimestamp)
        .setAuthor({ name: after.author.tag, iconURL: after.author.avatarURL() })
        .setURL(after.url)
        .addFields(
            { name: "Before", value: before.cleanContent, inline: false },
            { name: "After", value: after.cleanContent, inline: false }
        );
        const client = before.client;
        const channel = await client.channels.fetch(process.env.editedLogsChannelId);

		await channel.send({ embeds: [embed] });
	}
};
