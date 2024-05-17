const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Renames a specific User')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to mute")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("nickname")
            .setDescription("Nickname you want to set")
            .setMinLength(1)
            .setMaxLength(32)
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
	async execute(interaction) {
        const user = interaction.options.getUser("user");
        const nickname = interaction.options.getString("nickname");

        await user.edit({nick: nickname});
        await interaction.reply({content: `Muted ${user}.`});
    }
};
