# Big-Brother-JS

Big-Brother-JS is a Discord bot built using Discord.js. It provides various utility commands and event handling features to enhance server management and user interaction.

## Features

- Role management through reactions.
- Server and user information commands.
- Message logging for edits and deletions.
- Welcome and goodbye messages for new and departing members.
- Command handling for user mutes, unmutes, and nickname changes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alpisc/Big-Brother-JS/
   ```
2. Navigate to the project directory:
   ```bash
   cd Big-Brother-JS
   ```
3. Install dependencies:
   ```bash
   pnpm install
   ```

## Configuration

Create a `.env` file in the root directory and add the following variables:
- `token`: Your Discord bot token.
- `clientId`: Your Discord application client ID.
- `guildId`: Your Discord server (guild) ID.
- `reactionChannelId`, `reactionChannelLogId`, `welcomeChannelId`, `ruleChannelId`, `editedLogsChannelId`, `deletedLogsChannelId`: Channel IDs for various functionalities.

## Running the Bot

To start the bot, run:
```bash
node index.js
```

## Commands

- `/ping`: Check the bot's latency.
- `/server`: Get server details.
- `/user`: Get user details.
- `/avatar`: Fetch a user's avatar.
- `/purge`: Delete a specified number of messages.
- `/mute`, `/unmute`, `/rename`: Manage user roles and nicknames.

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for any bugs or enhancements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.