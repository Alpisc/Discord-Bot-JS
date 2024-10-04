const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmutevoice')
        .setDescription('Unmutes all users in a voicechat')
        .addChannelOption(option =>
            option
                .setName("voicechat")
                .setDescription("Which channel do you want to unmute?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice) // Ensures only voice channels are shown
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const voicechat = interaction.options.getChannel("voicechat");

        if (!voicechat || voicechat.type !== ChannelType.GuildVoice) {
            return interaction.reply({ content: 'Please provide a valid voice channel.', ephemeral: true });
        }

        try {
            voicechat.members.forEach(member => {
                member.voice.setMute(false, 'Unmuted by bot command');
            });

            await interaction.reply({ content: `Unmuted all users in \`${voicechat.name}\`.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error unmuting the users in the voice channel.', ephemeral: true });
        }
    }
};
