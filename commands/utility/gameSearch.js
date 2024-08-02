const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gamesearch')
        .setDescription('If you want to play games and look for others to join')
        .addStringOption(option =>
            option
                .setName("game")
                .setDescription("Supply the game name (from role selection)")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("amount")
                .setDescription("The least amount of players you need to play (you included)")
                .setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();
        const game = interaction.options.getString("game").toLowerCase();

        let neededPlayers = Math.min(interaction.options.getInteger("amount"), interaction.guild.memberCount);

        let counter = 0;
        let users = new Set();

        const rolesPath = path.join(__dirname, '..', '..', 'roles.json');
        const roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));

        let role = interaction.guild.roles.cache.find(role => role.name.toLowerCase() === game);
        let valid = roles.some(roleId => roleId === role.id);

        if (!role || !valid) {
            await interaction.editReply({ content: `The game \`${game}\` is not available. Please choose another game.` });
            return;
        }
        if (neededPlayers <= 1) {
            await interaction.editReply({ content: "You need to be looking for more than one person" });
            return;
        }

        // first player is being added
        counter++;
        users.add(interaction.user.id);

        let userMentions = Array.from(users).map(id => `<@${id}>`).join(', ');

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${interaction.user.username} is looking for others to play \`${role.name}\``)
            .setDescription(`${counter}/${neededPlayers}\n${userMentions}`);

        const uniqueId = uuidv4(); // Generate a unique ID for this interaction
        const button = new ButtonBuilder()
            .setCustomId(`click_${uniqueId}`) // Use the unique ID in the custom ID
            .setLabel('Join/ Leave')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.channel.send({ content: `${role}` });
        await interaction.editReply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === `click_${uniqueId}`; // Filter for the unique custom ID
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 600000 });

        collector.on('collect', async i => {
            if (users.has(i.user.id)) {
                counter--;
                users.delete(i.user.id);
            } else {
                counter++;
                users.add(i.user.id);
            }

            userMentions = Array.from(users).map(id => `<@${id}>`).join(', ');

            const newEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${interaction.user.username} is looking for others to play \`${role.name}\``)
                .setDescription(`${counter}/${neededPlayers}\n${userMentions}`);

            await i.update({ embeds: [newEmbed], components: [row] });

            if (counter >= neededPlayers) {
                await interaction.followUp(`Enough players want to play \`${role.name}\`!: ${userMentions}`);
                collector.stop();
            }

            if (counter === 0) {
                collector.stop();
            }
        });

        collector.on('end', async collected => {
            const disabledButton = new ButtonBuilder()
                .setCustomId(`click_${uniqueId}`)
                .setLabel('Join/ Leave')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            const disabledRow = new ActionRowBuilder()
                .addComponents(disabledButton);

            const timeOutEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${interaction.user.username} is looking for others to play \`${role.name}\``)
                .setDescription('This Player search has ended');

            await interaction.editReply({ embeds: [timeOutEmbed], components: [disabledRow] });
        });
    }
};