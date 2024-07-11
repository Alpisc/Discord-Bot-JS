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
        const roleId = roles.find(id => {
            const role = interaction.guild.roles.cache.get(id);
            return role && role.name.toLowerCase() === name.toLowerCase();
        });

        if (!roleId) {
            await interaction.editReply({ content: `Role with name \`${name}\` not found.` });
            return;
        }

        // Delete the role in Discord
        try {
            const role = await interaction.guild.roles.fetch(roleId);
            if (role) {
                const roleName = role.name; // Use a new variable to avoid reassigning `name`
                await role.delete({ reason: `Deleted via interaction from ${interaction.member.displayName}` });
            }
        } catch (e) {
            await interaction.editReply({ content: `Failed to delete role: ${e}` });
            return;
        }

        // Remove the role ID from the JSON data
        const updatedRoles = roles.filter(id => id !== roleId);

        // Save the updated JSON back to the file
        const newData = JSON.stringify(updatedRoles, null, 4);
        try {
            await fs.promises.writeFile(rolesPath, newData); // Use fs.promises.writeFile for async/await
        } catch (err) {
            await interaction.editReply({ content: `Error saving new JSON config: ${err}` });
            return;
        }

        await sendReactionRole(interaction.client, updatedRoles);

        await interaction.editReply({ content: `Deleted \`${name}\` and Updated reaction roles!` });
    }
};