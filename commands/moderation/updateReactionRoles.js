const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const roles = require("../../roles.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('updatereactionroles')
		.setDescription('Updates the reaction roles')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const channel = await interaction.client.channels.cache.get(process.env.reactionChannelId);
        if (!channel) return;
    
        const rows = [];
        let row = new ActionRowBuilder();
    
        roles.forEach((role, index) => {
            if (index % 5 === 0 && index !== 0) { // Every 5 entries, start a new row
                rows.push(row);
                row = new ActionRowBuilder();
            }
            row.addComponents(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });
    
        rows.push(row); // Push the last row even if it's not full
    
        await channel.bulkDelete(1);
    
        await channel.send({ content: "Claim or remove a role", components: rows });
        await interaction.reply({ content: "Updated reaction roles", ephemeral: true });
    }
};
