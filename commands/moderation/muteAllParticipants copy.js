const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mutevoice')
        .setDescription('Mutes all users in a voicechat')
        .addChannelOption(option =>
            option
                .setName("voicechat")
                .setDescription("Which channel do you want to be quiet?")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildVoice) // This line ensures only voice channels are shown
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
    async execute(interaction) {
        const voicechat = interaction.options.getChannel("voicechat");

        if (!voicechat || voicechat.type !== ChannelType.GuildVoice) {
            return interaction.reply({ content: 'Please provide a valid voice channel.', ephemeral: true });
        }

        try {
            voicechat.members.forEach(member => {
                member.voice.setMute(true, 'Muted by bot command');
            });

            await interaction.reply({ content: `Muted all users in \`${voicechat.name}\`.`, ephemeral: true });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error muting the users in the voice channel.', ephemeral: true });
        }
    }
};
