const { Events, EmbedBuilder  } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();
const { deletedLogsChannelId } = process.env;

module.exports = {
    name: Events.MessageDelete,
    async execute(before) {
        const embed = new EmbedBuilder()
        .setTitle(`Message deleted in ${before.channel}`)
        .setURL(before.url)
        .setTimestamp(before.createdTimestamp)
        .setAuthor({ name: before.author.tag, iconURL: before.author.avatarURL() })
        .addFields(
            { name: "Deleted:", value: before.cleanContent || "No content", inline: false }
        );
        const client = before.client;
        const channel = await client.channels.fetch(deletedLogsChannelId);

        await channel.send({ embeds: [embed] });
    }
};