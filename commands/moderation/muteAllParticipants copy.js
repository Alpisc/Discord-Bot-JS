const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mutevoice')
		.setDescription('Mutes all users in a voicechat')
        .addChannelOption(option =>
            option
                .setName("voicechat")
                .setDescription("Which channel do you want to be quiet?")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers),
	async execute(interaction) {
        const voicechat = interaction.options.getChannel("voicechat");

        if (!voicechat || voicechat.type !== 'GUILD_VOICE') {
            return interaction.reply({ content: 'Please provide a valid voice channel.', ephemeral: true });
        }

        voicechat.members.forEach(member => {
            member.voice.setMute(true, 'Muted by bot command');
        });

        await interaction.reply({ content: `Muted all users in ${voicechat.name}.` });

    }
};
