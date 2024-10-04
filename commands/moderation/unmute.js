const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unmute')
		.setDescription('Unmutes a specific User in a text channel')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Who do you want to unmute")
                .setRequired(true)
        )
        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("The channel to unmute the user in")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
	async execute(interaction) {
        const user = interaction.options.getMember("user"); // Use getMember to get the GuildMember object
        const channel = interaction.options.getChannel("channel"); // Get the specified channel

        if(user.id === interaction.member.id){
            return interaction.reply({ content: "You can't unmute yourself.", ephemeral: true });
        }

        await channel.permissionOverwrites.edit(user, { SEND_MESSAGES: null }); // Update permissions to unmute the user in the text channel
        await interaction.reply({content: `Unmuted ${user} in ${channel}.`});
    }
};
