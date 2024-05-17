const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Displays the Bot\'s latency.'),
	async execute(interaction) {
		await interaction.reply({ content: `🏓Latency is ${Math.abs(Date.now() - interaction.createdTimestamp)}ms.` });
	},
};