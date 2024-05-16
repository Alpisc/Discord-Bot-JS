const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Moves users from one channel to another.')
        .addChannelOption(option =>
            option
            .setName("from")
            .setDescription("From where do you want to move the users?")
            .setRequired(true)
        )
        .addChannelOption(option =>
            option
            .setName("to")
            .setDescription("Where do you want to move the users to?")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers),
	async execute(interaction) {
        let from = interaction.options.getString('from');
        let to = interaction.options.getString('to');
        let counter = 0;
        if(from == to) return;
        from.members.forEach((member) => {
            if(member.voice.channel){
                member.voice.setChannel(to);
                counter++;
            }
        });

		await interaction.send(`Moved ${counter} users from <#${from.id}> to <#${to.id}>`);
	},
};