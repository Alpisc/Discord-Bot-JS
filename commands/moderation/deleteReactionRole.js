const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require("fs");
const path = require("path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deletereactionrole')
		.setDescription('Deletes an existing reaction role')
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("Which role do you want to delete?")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const name = interaction.options.getString("name");
        await interaction.deferReply({ ephemeral: true });

        const rolesPath = path.join(__dirname, "../../roles.json");
        const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));

        // Find the role in the JSON data
        const roleIndex = roles.findIndex(role => role.label.toLowerCase() === name.toLowerCase());
        if (roleIndex === -1) {
            await interaction.editReply({ content: `Role with label \`${name}\` not found.` });
            return;
        }

        const roleId = roles[roleIndex].id;

        // Delete the role in Discord
        try {
            const role = await interaction.guild.roles.fetch(roleId);
            if (role) {
                await role.delete({ reason: `Deleted via interaction from ${interaction.member.displayName}` });
            }
        } catch (e) {
            await interaction.editReply({ content: `Failed to delete role: ${e}` });
            return;
        }

        // Remove the role from the JSON data
        roles.splice(roleIndex, 1);

        // Save the updated JSON back to the file
        const newData = JSON.stringify(roles, null, 4);
        fs.writeFile(rolesPath, newData, async err => {
            if (err) {
                await interaction.editReply({ content: `Error saving new JSON config: ${err}` });
                return;
            }
        });

        // Update the buttons in the reaction channel
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
        await interaction.editReply({ content: `Deleted \`${name}\` and Updated reaction roles!` });
    }
};
