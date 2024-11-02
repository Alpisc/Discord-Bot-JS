const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('move')
        .setDescription('Moves users from one voice channel to another.')
        .addChannelOption(option =>
            option
                .setName("from")
                .setDescription("From where do you want to move the users?")
                .setRequired(true)
                .addChannelTypes([ChannelType.GuildVoice]) // Restrict to voice channels
        )
        .addChannelOption(option =>
            option
                .setName("to")
                .setDescription("Where do you want to move the users to?")
                .setRequired(true)
                .addChannelTypes([ChannelType.GuildVoice]) // Restrict to voice channels
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
        async execute(interaction) {
            await interaction.deferReply();
            const from = interaction.options.getChannel('from');
            const to = interaction.options.getChannel('to');
        
            // Ensure both channels are voice channels
            if (from.type !== ChannelType.GuildVoice || to.type !== ChannelType.GuildVoice) {
                return interaction.editReply({ content: "Both channels must be voice channels.", ephemeral: true });
            }
        
            // Prevent moving users to the same channel
            if (from.id === to.id) {
                return interaction.editReply({ content: "You cannot move users to the same channel.", ephemeral: true });
            }
        
            let counter = 0;
        
            // Check if there are members in the 'from' channel
            if (from.members.size === 0) {
                return interaction.editReply({ content: "There are no users in the voice channel to move.", ephemeral: true });
            }
        
            // Move members from 'from' channel to 'to' channel
            from.members.forEach(member => {
                if (member.voice.channel) {
                    member.voice.setChannel(to);
                    counter++;
                }
            });
        
            await interaction.editReply({content: `Moved ${counter} users from <#${from.id}> to <#${to.id}>` });
        },
};
