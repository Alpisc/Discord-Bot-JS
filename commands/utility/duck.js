const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duck')
        .setDescription('Random image/ gif of duck(s).'),
    async execute(interaction) {
        try {
            const url = await axios.get("https://random-d.uk/api/quack").data.url;
            await interaction.reply({ content: url });
        } catch (error) {
            await interaction.reply({ content: `Error:\`${error}\``, ephemeral: true });
        }
    },
};
