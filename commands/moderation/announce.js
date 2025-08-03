const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Sends an announcement')
        .addStringOption(option =>
            option
            .setName("announcement")
            .setDescription("The announcement you want to send")
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const announcement = interaction.options.getString("announcement");

        await interaction.client.channels.cache.get(process.env.announcementChannelId).send({ content: `# 🔔🔔 Annoucement 🔔🔔\n\n${announcement}` });
        await interaction.reply({content: `Send announcement in <#${process.env.announcementChannelId}>.`, ephemeral: true});
    }
};


