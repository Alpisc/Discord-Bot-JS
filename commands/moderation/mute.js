const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('Mutes a specific User')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to mute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
	async execute(interaction) {
        const user = interaction.options.getMember("user"); // Use getMember instead of getUser
        
        if(user.id === interaction.member.id){
            return interaction.reply({ content: "You can't mute yourself.", ephemeral: true });
        }

        await user.voice.setMute(true); // Use setMute method on the GuildMember's voice state
        await interaction.reply({content: `Muted ${user}.`});
    }
};
