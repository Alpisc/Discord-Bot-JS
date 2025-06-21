const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('varoteams')
        .setDescription('Shows the status of all Varo teams.'),
    async execute(interaction) {
        const filePath = path.join(__dirname, '..', '..', 'varo.json');

        let varoData;
        try {
            delete require.cache[require.resolve(filePath)];
            varoData = require(filePath);
        } catch (error) {
            console.error('Error loading varo.json:', error);
            return interaction.reply({ content: 'Failed to load Varo data.', ephemeral: true });
        }

        if (!varoData.Status) {
            return interaction.reply('Varo is not currently running.');
        }

        const teams = varoData.Teams;
        let message = `**Varo is currently running:**\n`;

        for (const [teamNumber, members] of Object.entries(teams)) {
            message += `\n**Team ${teamNumber}:**\n`;

            for (const [player, status] of Object.entries(members)) {
                const statusText = status === 1 ? '🟢 LIVING' : '🔴 DEAD';
                message += `• ${player} : ${statusText}\n`;
            }
        }

        await interaction.reply({ content: message });
    },
};
