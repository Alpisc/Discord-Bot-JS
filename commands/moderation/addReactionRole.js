const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require("fs");
const path = require("path");
const sendReactionRole = require("../../functions/sendReactionRole");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addreactionrole')
		.setDescription('Creates a new reaction role')
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("How should the role be called")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const name = interaction.options.getString("name").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // get the name, and make each word uppercase
        await interaction.deferReply({ ephemeral: true });

        const rolesPath = path.join(__dirname, "../../roles.json");
        const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));

        let role = await interaction.guild.roles.create({
            name: name,
            reason: `Created via interaction from ${interaction.member.displayName}`,
            mentionable: true
        })
        .catch(async (e) => {
            await interaction.editReply({ content: `Failed to create role: ${e}`});
            return;
        })

        roles.push(role.id);

        let newData = JSON.stringify(roles, null, 4);
        fs.writeFile(rolesPath, newData, async err => {
            if (err) {
                await interaction.editReply({content: `Error saving new JSON config: ${err}`});
                return;
            }
        })

        await sendReactionRole(interaction.client, roles);

        await interaction.editReply({ content: `Created \`${name}\` and Updated reaction roles!` });
    }
};