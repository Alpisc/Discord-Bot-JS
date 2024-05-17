const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Shows the avatar of a specified user.')
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User you want the profile picture of.")
                .setRequired(true)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const avatarURL = user.displayAvatarURL({ format: 'png', size: 1024 });

        try {
            const response = await axios({
                url: avatarURL,
                method: 'GET',
                responseType: 'stream'
            });

            const filePath = path.join(__dirname, 'avatar.png');
            const writer = fs.createWriteStream(filePath);

            response.data.pipe(writer);

            writer.on('finish', async () => {
                try {
                    await interaction.reply({ files: [{ attachment: filePath, name: 'avatar.png' }] });
                } finally {
                    // Delete the file after sending it
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        }
                    });
                }
            });

            writer.on('error', (err) => {
                console.error('Error writing file:', err);
                interaction.reply('There was an error processing the avatar image.');
            });
        } catch (error) {
            console.error('Error downloading avatar:', error);
            interaction.reply('There was an error downloading the avatar image.');
        }
    },
};
