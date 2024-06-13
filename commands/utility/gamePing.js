const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

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
        const game = interaction.options.getString("game");
        const neededPlayers = interaction.options.getInteger("amount");

        let counter = 0;
        let users = new Set();

        const roles = require("../../roles.json")

        const role = roles.find(role => role.label === game);
        if (!role) {
            await interaction.reply({ content: `The game "${game}" is not available. Please choose another game.`, ephemeral: true });
            return;
        }

        // first player is being added
        counter++;
        users.add(interaction.user.id);

        const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(`${interaction.user.username} is looking for others to play ${role.label}`)
            .setDescription(`<@&${role.id}>\n${counter}/${neededPlayers}`);

        const button = new ButtonBuilder()
            .setCustomId('click')
            .setLabel('Join/ Leave')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
            .addComponents(button);

        await interaction.reply({ embeds: [embed], components: [row] });

        const filter = i => i.customId === 'click';
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 300000 });

        collector.on('collect', async i => {
            if (users.has(i.user.id)) {
                counter--;
                users.delete(i.user.id);
            } else {
                counter++;
                users.add(i.user.id);
            }

            const newEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${interaction.user.username} is looking for others to play ${role.label}`)
                .setDescription(`<@&${role.id}>\n${counter}/${neededPlayers}`);

            await i.update({ embeds: [newEmbed], components: [row] });

            if (counter === 5) {
                const userMentions = Array.from(users).map(id => `<@${id}>`).join(', ');
                await interaction.followUp(`Enough players want to play ${role.label}!: ${userMentions}`);
                collector.stop();
            }
        });

        collector.on('end', async collected => {
            const disabledButton = new ButtonBuilder()
                .setCustomId('click')
                .setLabel('Join/ Leave')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            const disabledRow = new ActionRowBuilder()
                .addComponents(disabledButton);

            const timeOutEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${interaction.user.username} is looking for others to play ${role.label}`)
                .setDescription('Time has run out, not enough others wanted to play');

            await interaction.editReply({ embeds: [timeOutEmbed], components: [disabledRow] });
        });
    }
};
