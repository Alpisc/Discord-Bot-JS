const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a specific User')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to unmute")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
	async execute(interaction) {
        const user = interaction.options.getUser("user");
        
        if(user == interaction.member){
            return interaction.reply({ content: "You cant unmute yourself.", ephemeral: true }); //propapy not needed since you cant write
        }

        await user.edit({mute: true});
        await interaction.reply({content: `Unmuted ${user}.`});
    }
};
