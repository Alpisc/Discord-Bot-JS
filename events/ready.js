const { Events, ActivityType } = require('discord.js');
const path = require('node:path');
const fs = require('node:fs');
const sendReactionRole = require("../functions/sendReactionRole");

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		const utilityCommandsPath = path.join(__dirname, '../commands/utility');
		let commandNames = [];
		const cycleMinutes = 5;
		
		try {
			const commandFiles = fs.readdirSync(utilityCommandsPath)
				.filter(file => file.endsWith('.js'));
			
			commandNames = commandFiles.map(file => file.slice(0, -3));
			
			console.log(`[Status Cycle] Found ${commandNames.length} commands to cycle through`);
		} catch (error) {
			console.error('Could not read utility commands directory:', error);
		}

		let currentIndex = 0;
		const updatePresence = () => {
			if (commandNames.length === 0) return;
			
			const commandName = commandNames[currentIndex];
			try{
				client.user.setPresence({
					activities: [{
						name: `have you tried out /${commandName} ?`,
						type: ActivityType.Watching
					}],
					status: 'dnd'
				})
			} catch(error) {
				console.error(error)
			}
			
			currentIndex = (currentIndex + 1) % commandNames.length;
		};

		if (commandNames.length > 0) {
			updatePresence();
			const intervalTime = 60 * cycleMinutes * 1000;
			setInterval(updatePresence, intervalTime);
			console.log(`[Status Cycle] Cycling every ${cycleMinutes} minutes`);
		}

		const rolesPath = path.join(__dirname, "../roles.json");
		const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));
		await sendReactionRole(client, roles);
	},
};