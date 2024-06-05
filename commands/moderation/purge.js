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
        const messageCount = interaction.options.getInteger("amount");

        try {
            const messages = await interaction.channel.messages.fetch({ limit: messageCount });
            await interaction.channel.bulkDelete(messages);
            await interaction.reply({content: `Successfully deleted \`${messageCount}\` messages`})
        } catch (error) {
            console.error('Error purging messages:', error);
            await interaction.reply({ content: 'There was an error purging messages.', ephemeral: true });
        }
	},
};
