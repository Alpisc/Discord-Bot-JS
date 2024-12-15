const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
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
        const name = interaction.options.getString("name").toLowerCase();
        await interaction.deferReply({ ephemeral: true });

        const rolesPath = path.join(__dirname, "../../roles.json");
        const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));

        let role;
        let roleIndex;
        try {
            role = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === name);
            roleIndex = roles.indexOf(role.id);
        } catch (e) {
            await interaction.editReply({ content: `Failed to delete role: ${e.toString().replace("TypeError: Cannot read properties of undefined (reading 'id')", "Role doesnt exist")}` });
            return;
        }

        if (roleIndex === -1) {
            await interaction.editReply({ content: `Role with label \`${name}\` not found.` });
            return;
        }

        let roleName;
        if (role) {
            roleName = role.name
            await role.delete({ reason: `Deleted via interaction from ${interaction.member.displayName}` });
        }

        // Remove the role from the JSON data
        roles.splice(roleIndex, 1);

        // Save the updated JSON back to the file
        const newData = JSON.stringify(roles, null, 4);
        try {
            await fs.promises.writeFile(rolesPath, newData); // Use fs.promises.writeFile for async/await
        } catch (err) {
            await interaction.editReply({ content: `Error saving new JSON config: ${err}` });
            return;
        }

        await sendReactionRole(interaction.client, roles);

        await client.channels.cache.get(process.env.reactionChannelLogId).send({ content: `${interaction.user} deleted \`${name}\`` });
        await interaction.editReply({ content: `Deleted \`${roleName}\` and Updated reaction roles!` });
    }
};