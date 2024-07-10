const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('duck')
        .setDescription('Random image/ gif of duck(s).'),
    async execute(interaction) {
        try {
            const response = await axios.get("https://random-d.uk/api/quack");
            const url = response.data.url;
            await interaction.reply({ files: [{ attachment: url }] });
        } catch (error) {
            await interaction.reply({ content: `Error:\`${error}\``, ephemeral: true });
        }
    },
};