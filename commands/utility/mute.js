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
        const user = interaction.options.getUser("user");
        
        if(user == interaction.member){
            return interaction.reply({ content: "You cant mute yourself.", ephemeral: true });
        }

        await user.edit({mute: true});
        await interaction.reply({content: `Muted ${user}.`});
    }
};
