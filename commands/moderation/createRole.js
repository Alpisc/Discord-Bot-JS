const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('createrole')
		.setDescription('Creates a role with a specific name and returns the id')
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("how should the role be called")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const name = interaction.options.getString("name");
        await interaction.deferReply({ ephemeral: true });

        let role = await interaction.guild.roles.create({
            name: name,
            reason: `Created via interaction from ${interaction.member.displayName}`,
          })
          .catch(async (e) => {
            await interaction.editReply({ content: `Failed to create role: ${e}`});
            return;
          })
        
        await interaction.editReply({ content: `Created Role ${name} with ID: \`${role.id}\`` })
    }
};
