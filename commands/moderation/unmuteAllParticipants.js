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
            await interaction.guild.members.fetch();

            const membersInVoiceChannel = interaction.guild.members.cache.filter(member => 
                member.voice.channelId === voicechat.id && member.voice.serverMute
            );

            if (membersInVoiceChannel.size === 0) {
                return interaction.reply({ content: `No muted users found in \`${voicechat.name}\`.`, ephemeral: true });
            }

            const mutePromises = membersInVoiceChannel.map(member => 
                member.voice.setMute(false, 'Unmuted by bot command')
            );
            await Promise.all(mutePromises);

            await interaction.reply({ content: `Unmuted ${membersInVoiceChannel.size} user(s) in \`${voicechat.name}\`.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error unmuting the users in the voice channel.', ephemeral: true });
        }
    }
};
