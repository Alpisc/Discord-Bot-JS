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
		const updatePresence = async () => {
			if (commandNames.length === 0) return;

			const useCommand = Math.random() < 0.7;

			try {
				if (useCommand) {
					const commandName = commandNames[currentIndex];
					client.user.setPresence({
						activities: [{
							name: `have you tried out /${commandName} ?`,
							type: ActivityType.Playing
						}],
						status: 'dnd'
					});
					currentIndex = (currentIndex + 1) % commandNames.length;
				} else {
					const guild = client.guilds.cache.first();
					if (!guild) {
						console.log('No guild available for member status');
						return this.execute(client);
					}

					await guild.members.fetch({ withPresences: true });
					const onlineMembers = guild.members.cache.filter(member => 
						!member.user.bot &&
						member.user.id !== client.user.id &&
						member.presence?.status !== 'offline'
					);

					if (onlineMembers.size === 0) {
						const commandName = commandNames[currentIndex];
						client.user.setPresence({
							activities: [{
								name: `have you tried out /${commandName} ?`,
								type: ActivityType.Playing
							}],
							status: 'dnd'
						});
						currentIndex = (currentIndex + 1) % commandNames.length;
					} else {
						const randomMember = onlineMembers.random();
						client.user.setPresence({
							activities: [{
								name: `${randomMember.user.username}`,
								type: ActivityType.Watching
							}],
							status: 'dnd'
						});
					}
				}
			} catch (error) {
				console.error('Error updating presence:', error);
			}
		};

		if (commandNames.length > 0) {
			updatePresence().catch(error => console.error('Initial presence update error:', error));
			const intervalTime = 60 * cycleMinutes * 1000;
			setInterval(() => {
				updatePresence().catch(error => console.error('Interval presence update error:', error));
			}, intervalTime);
			console.log(`[Status Cycle] Cycling every ${cycleMinutes} minutes`);
		}

		const rolesPath = path.join(__dirname, "../roles.json");
		const roles = JSON.parse(fs.readFileSync(rolesPath, "utf-8"));
		await sendReactionRole(client, roles);
	},
};