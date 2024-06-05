require("dotenv").config();

const { Client, IntentsBitField, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const roles = require("./roles.json")

const client = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMembers
] });

client.on("ready", async (client) => {
  try {
    const channel = await client.channels.cache.get(process.env.reactionChannelId);
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

    await channel.messages.fetch({ limit: 1 }).then(messages => {
      const mostRecentMessage = messages.array().pop();
      mostRecentMessage.delete();
    });

    await channel.send({ content: "Claim or remove a role", components: rows });

    process.exit()

  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.token)