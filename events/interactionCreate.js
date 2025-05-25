require("dotenv").config();
const { Events } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Role claim button(s)

        if (interaction.isButton() && !interaction.customId.startsWith("click_") && !interaction.customId.startsWith("stop_")) {
            
            try {
                await interaction.deferReply({ ephemeral: true });
            } catch (error) {
                console.log(`Error: ${error}`)
            }

            const role = interaction.guild.roles.cache.get(interaction.customId);

            if (!role) {
                await interaction.editReply({ content: "Role not found" });
                return;
            };

            if (interaction.member.roles.cache.has(role.id)) {
                await interaction.member.roles.remove(role);
                await interaction.editReply({ content: `${role} removed` });
                const channel = await interaction.client.channels.fetch(process.env.reactionChannelLogId);
                await channel.send(`${interaction.user} removed \`${role.name}\``);
            } else {
                await interaction.member.roles.add(role);
                await interaction.editReply({ content: `${role} added` });
                const channel = await interaction.client.channels.fetch(process.env.reactionChannelLogId);
                await channel.send(`${interaction.user} added \`${role.name}\``);
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        let command = interaction.client.commands.get(interaction.commandName) || interaction.client.aliases.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
                } else {
                    await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
                }
            } catch (followUpError) {
                console.error('Failed to send error message:', followUpError);
            }
        }
    }
};