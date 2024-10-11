const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a specific User in all channels')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to mute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
	async execute(interaction) {
        const user = interaction.options.getMember("user");

        if(user.id === interaction.member.id){
            return interaction.reply({ content: "You can't mute yourself.", ephemeral: true });
        }

        const muteRole = interaction.guild.roles.cache.find(role => role.name === "Muted");
        if (!muteRole) {
            return interaction.reply({ content: "Muted role not found. Please create a 'Muted' role with appropriate permissions.", ephemeral: true });
        }

        await user.roles.add(muteRole);
        await interaction.reply({content: `Muted ${user} in all channels.`});
    }
};
