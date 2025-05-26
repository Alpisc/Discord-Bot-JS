const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

function clearRoleName(s) {
    return s.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/\s+/g, '');      
}

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

        let neededPlayers = Math.min(interaction.options.getInteger("amount"), interaction.guild.memberCount);

        let counter = 0;
        let users = new Set();

        const rolesPath = path.join(__dirname, '..', '..', 'roles.json');
        const roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));

        let role = interaction.guild.roles.cache.find(role => clearRoleName(role.name) === clearRoleName(game));
        let valid;
        if (role) {
            valid = roles.some(roleId => roleId === role.id);
        }

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

        const uniqueId = uuidv4();
        const joinButton = new ButtonBuilder()
            .setCustomId(`click_${uniqueId}`)
            .setLabel('Join/ Leave')
            .setStyle(ButtonStyle.Primary);

        const stopButton = new ButtonBuilder()
            .setCustomId(`stop_${uniqueId}`)
            .setLabel('Stop Search')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(joinButton, stopButton);

        await interaction.channel.send({ content: `${role}` });
        await interaction.editReply({ embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ 
            filter: i => i.customId === `click_${uniqueId}` || i.customId === `stop_${uniqueId}`,
            time: 600000 
        });

        collector.on('collect', async i => {
            if (i.customId === `stop_${uniqueId}`) {
                if (i.user.id !== interaction.user.id) {
                    await i.reply({ content: 'Only the person who started the search can stop it.', ephemeral: true });
                    return;
                } else {
                    await i.reply({content: "Stopped the gamesearch.", ephemeral: true})
                }
                collector.stop('cancelled');
                return;
            }

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

        collector.on('end', async (collected, reason) => {
            const disabledJoinButton = new ButtonBuilder()
                .setCustomId(`click_${uniqueId}`)
                .setLabel('Join/ Leave')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(true);

            const disabledStopButton = new ButtonBuilder()
                .setCustomId(`stop_${uniqueId}`)
                .setLabel('Stop Search')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true);

            const disabledRow = new ActionRowBuilder()
                .addComponents(disabledJoinButton, disabledStopButton);

            const timeOutEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle(`${interaction.user.username} is looking for others to play \`${role.name}\``)
                .setDescription(reason === 'cancelled' ? 'This Player search was stopped' : 'This Player search has ended');

            await interaction.editReply({ embeds: [timeOutEmbed], components: [disabledRow] });
        });
    }
};