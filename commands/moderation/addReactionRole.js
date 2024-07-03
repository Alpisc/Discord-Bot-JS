const { SlashCommandBuilder, PermissionFlagsBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require("fs");
const path = require("path");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('addreactionrole')
		.setDescription('Creates a new reaction role')
        .addStringOption(option =>
            option
                .setName("name")
                .setDescription("How should the role be called")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
        const name = interaction.options.getString("name").replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()); // get the name, and make each word uppercase
        await interaction.deferReply({ ephemeral: true });

        const rolesPath = path.join(__dirname, "../../roles.json");
        const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));

        let role = await interaction.guild.roles.create({
            name: name,
            reason: `Created via interaction from ${interaction.member.displayName}`,
            mentionable: true
        })
        .catch(async (e) => {
            await interaction.editReply({ content: `Failed to create role: ${e}`});
            return;
        })

        let newRole = {
            "id": role.id,
            "label": name
        }

        roles.push(newRole);

        let newData = JSON.stringify(roles, null, 4);
        fs.writeFile(rolesPath, newData, async err => {
            if (err) {
                await interaction.editReply({content: `Error saving new JSON config: ${err}`});
                return;
            }
        })

        const channel = await interaction.client.channels.cache.get(process.env.reactionChannelId);
        if (!channel) return;
    
        const rows = [];
        let row = new ActionRowBuilder();
    
        roles.forEach((role, index) => {
            if (index % 5 === 0 && index !== 0) { // Every 5 entries, start a new row
                rows.push(row);
                row = new ActionRowBuilder();
            }
            row.addComponents(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            );
        });
    
        rows.push(row); // Push the last row even if it's not full
    
        await channel.bulkDelete(1);
    
        await channel.send({ content: "Claim or remove a role", components: rows });
        await interaction.editReply({ content: `Created \`${name}\` and Updated reaction roles!` });
    }
};
