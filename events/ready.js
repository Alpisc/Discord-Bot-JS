const { Events, ActivityType } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const sendReactionRole = require("../functions/sendReactionRole");


module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
        await client.user.setPresence({ activities: [{ name: 'You', type: ActivityType.Watching }], status: 'dnd' });

		const rolesPath = path.join(__dirname, "../roles.json");
		const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));
	
		await sendReactionRole(client, roles);
	},
};