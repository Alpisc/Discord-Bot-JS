const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a specific User in all channels')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to unmute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
	async execute(interaction) {
        const user = interaction.options.getMember("user");

        if(user.id === interaction.member.id){
            return interaction.reply({ content: "You can't unmute yourself.", ephemeral: true });
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) {
            return interaction.reply({ content: "Muted role not found.", ephemeral: true });
        }

        await user.roles.remove(muteRole);
        await interaction.reply({content: `Unmuted ${user} in all channels.`});
    }
};
