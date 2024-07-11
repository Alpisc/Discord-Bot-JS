const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

async function sendReactionRole(client, roles) {
    const channel = await client.channels.cache.get(process.env.reactionChannelId);
    if (!channel) return;

    const rows = [];
    let row = new ActionRowBuilder();

    roles.forEach((roleId, index) => {
        if (index % 5 === 0 && index !== 0) { // Every 5 entries, start a new row
            rows.push(row);
            row = new ActionRowBuilder();
        }
        const role = channel.guild.roles.cache.get(roleId);
        if (role) {
            row.addComponents(
                new ButtonBuilder().setCustomId(roleId).setLabel(role.name).setStyle(ButtonStyle.Primary)
            );
        }
    });

    rows.push(row); // Push the last row even if it's not full

    await channel.bulkDelete(1);

    await channel.send({ content: "Claim or remove a role", components: rows });
}

module.exports = sendReactionRole;