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
        .addBooleanOption(option =>
            option.setName('ping')
            .setDescription('Whether or not @everyone should be pinged')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const announcement = interaction.options.getString("announcement");
        const ping = interaction.options.getBoolean('ping');

        await interaction.client.channels.cache.get(process.env.announcementChannelId).send({ content: `# 🔔🔔 Annoucement 🔔🔔\n\n${announcement}${ping ? "\n\n||@everyone||" : ""}` });
        await interaction.reply({content: `Send announcement in <#${process.env.announcementChannelId}>${ping ? " and pinged everyone" : ""}.`, ephemeral: true});
    }
};


