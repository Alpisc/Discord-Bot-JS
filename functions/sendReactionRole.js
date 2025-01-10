const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function sendReactionRole(client, roles) {
    const channel = await client.channels.cache.get(process.env.reactionChannelId);
    if (!channel) return;

    const MAX_ROWS_PER_MESSAGE = 5;
    const rows = [];
    let row = new ActionRowBuilder();

    roles.forEach((id, index) => {
        if (index % 5 === 0 && index !== 0) {
            rows.push(row);
            row = new ActionRowBuilder();
        }
        let role = channel.guild.roles.cache.find(role => role.id === id);
        row.addComponents(
            new ButtonBuilder().setCustomId(id).setLabel(role.name).setStyle(ButtonStyle.Primary)
        );
    });

    rows.push(row);

    const groupedRows = [];
    for (let i = 0; i < rows.length; i += MAX_ROWS_PER_MESSAGE) {
        groupedRows.push(rows.slice(i, i + MAX_ROWS_PER_MESSAGE));
    }

    const messages = await channel.messages.fetch({ limit: 100 });
    const now = Date.now();
    const fourteenDays = 14 * 24 * 60 * 60 * 1000;

    const bulkDeletableMessages = messages.filter(msg => now - msg.createdTimestamp < fourteenDays);
    const oldMessages = messages.filter(msg => now - msg.createdTimestamp >= fourteenDays);

    if (bulkDeletableMessages.size > 0) {
        await channel.bulkDelete(bulkDeletableMessages);
    }

    for (const msg of oldMessages.values()) {
        await msg.delete();
    }

    for (let i = 0; i < groupedRows.length; i++) {
        const content = i === 0 ? "Claim or remove a role" : `Claim or remove a role (part ${i + 1})`;
        await channel.send({ content, components: groupedRows[i] });
    }
}

module.exports = sendReactionRole;
