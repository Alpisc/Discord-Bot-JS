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
        if (!interaction.isRepliable()) {
            console.log('Interaction is not repliable');
            return;
        }

        if (interaction.replied || interaction.deferred) {
            console.log('Interaction already handled');
            return;
        }

        try {
            await interaction.deferReply();
        } catch (error) {
            console.log(`Failed to defer reply: ${error}`);
            return;
        }

        const game = interaction.options.getString("game");
        let neededPlayers = Math.min(interaction.options.getInteger("amount"), interaction.guild.memberCount);

        let counter = 0;
        let users = new Set();

        try {
            const rolesPath = path.join(__dirname, '..', '..', 'roles.json');
            const roles = JSON.parse(fs.readFileSync(rolesPath, 'utf8'));

            let role = interaction.guild.roles.cache.find(role => clearRoleName(role.name) === clearRoleName(game));
            let valid;
            if (role) {
                valid = roles.some(roleId => roleId === role.id);
            }

            if (!role || !valid) {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ content: `The game \`${game}\` is not available. Please choose another game.` });
                }
                return;
            }
            
            if (neededPlayers <= 1) {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ content: "You need to be looking for more than one person" });
                }
                return;
            }

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
            
            if (interaction.deferred && !interaction.replied) {
                await interaction.editReply({ embeds: [embed], components: [row] });
            }

            const collector = interaction.channel.createMessageComponentCollector({ 
                filter: i => i.customId === `click_${uniqueId}` || i.customId === `stop_${uniqueId}`,
                time: 60*1000 * 10 // 10 minutes
            });

            collector.on('collect', async i => {
                if (!i.isRepliable()) {
                    console.log('Button interaction is not repliable');
                    return;
                }

                if (i.replied || i.deferred) {
                    console.log('Button interaction already handled');
                    return;
                }

                try {
                    if (i.customId === `stop_${uniqueId}`) {
                        if (i.user.id !== interaction.user.id) {
                            await i.reply({ content: 'Only the person who started the search can stop it.', ephemeral: true });
                            return;
                        } else {
                            await i.reply({ content: "Stopped the gamesearch.", ephemeral: true });
                            collector.stop('cancelled');
                            return;
                        }
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
                        setTimeout(async () => {
                            try {
                                if (interaction.deferred) {
                                    await interaction.followUp(`Enough players want to play \`${role.name}\`!: ${userMentions}`);
                                }
                                collector.stop('completed');
                            } catch (followUpError) {
                                console.log(`Failed to send followUp message: ${followUpError}`);
                            }
                        }, 100);
                    }

                    if (counter === 0) {
                        collector.stop('empty');
                    }

                } catch (updateError) {
                    console.log(`Failed to handle button interaction: ${updateError}`);
                    
                    try {
                        if (!i.replied && !i.deferred) {
                            await i.reply({
                                content: 'Your action was processed, but there was an issue updating the display.',
                                ephemeral: true
                            });
                        }
                    } catch (replyError) {
                        console.log(`Failed to send alternative reply: ${replyError}`);
                    }
                }
            });

            collector.on('end', async (collected, reason) => {
                try {
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

                    let endMessage;
                    switch (reason) {
                        case 'cancelled':
                            endMessage = 'This Player search was stopped';
                            break;
                        case 'completed':
                            endMessage = 'This Player search was completed';
                            break;
                        case 'empty':
                            endMessage = 'This Player search ended (no players)';
                            break;
                        default:
                            endMessage = 'This Player search has ended';
                    }

                    const timeOutEmbed = new EmbedBuilder()
                        .setColor(0x0099ff)
                        .setTitle(`${interaction.user.username} is looking for others to play \`${role.name}\``)
                        .setDescription(endMessage);

                    if (interaction.deferred && !interaction.replied) {
                        await interaction.editReply({ embeds: [timeOutEmbed], components: [disabledRow] });
                    }
                } catch (endError) {
                    console.log(`Failed to handle collector end: ${endError}`);
                }
            });

        } catch (error) {
            console.error('GameSearch command error:', error);
            
            try {
                if (interaction.deferred && !interaction.replied) {
                    await interaction.editReply({ 
                        content: 'An error occurred while processing your game search request.' 
                    });
                }
            } catch (errorHandlingError) {
                console.log(`Failed to send error message: ${errorHandlingError}`);
            }
        }
    }
};
