const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rename')
		.setDescription('Renames a specific User')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Select the user to rename")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
            .setName("nickname")
            .setDescription("Nickname you want to set")
            .setMinLength(1)
            .setMaxLength(32)
            .setRequired(false) // Make nickname not required
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),
	async execute(interaction) {
        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id);
        let nickname = interaction.options.getString("nickname");

        let previousName = member.displayName;

        // Check if nickname is null or empty
        if (!nickname || nickname.trim() === "") {
            nickname = previousName;
        }

        await member.setNickname(nickname);
        await interaction.reply({content: `Changed ${user} nickname from ${previousName} to ${nickname}.`});
    }
};


