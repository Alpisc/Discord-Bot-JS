const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require("fs");
const path = require("path");
const sendReactionRole = require("../../functions/sendReactionRole");

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

        await sendReactionRole(roles);

        await interaction.editReply({ content: `Deleted \`${name}\` and Updated reaction roles!` });
    }
};
