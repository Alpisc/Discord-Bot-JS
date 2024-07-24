const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('purge')
		.setDescription('Purges a specified amount of messages.')
        .addIntegerOption(option =>
            option
            .setName("amount")
            .setDescription("Amount of messages you want to purge in this channel.")
            .setRequired(true)
        ),
	async execute(interaction) {
        await interaction.deferReply({ ephemeral: true });
        const messageCount = interaction.options.getInteger("amount");

        try {
            const messages = await interaction.channel.messages.fetch({ limit: messageCount });
            const messagesToDelete = messages.filter(msg => (Date.now() - msg.createdTimestamp) < 14 * 24 * 60 * 60 * 1000);

            await interaction.channel.bulkDelete(messagesToDelete);

            const oldMessages = messages.filter(msg => (Date.now() - msg.createdTimestamp) >= 14 * 24 * 60 * 60 * 1000);
            for (const msg of oldMessages.values()) {
                await msg.delete();
            }

            await interaction.editReply({content: `Successfully deleted \`${messagesToDelete.size + oldMessages.size}\` messages` });
        } catch (error) {
            console.error('Error purging messages:', error);
            await interaction.editReply({ content: 'There was an error purging messages.' });
        }
	},
};