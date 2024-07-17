# Discord-Bot-JS

Discord-Bot-JS is a Discord bot built using Discord.js. It provides various utility commands and event handling features to enhance server management and user interaction.

## Features

- Role management through reactions.
- Server and user information commands.
- Message logging for edits and deletions.
- Welcome and goodbye messages for new and departing members.
- Command handling for user mutes, unmutes, and nickname changes.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Alpisc/Discord-Bot-JS/
   ```
2. Navigate to the project directory:
   ```bash
   cd Discord-Bot-JS
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
- `reactionChannelId`, `reactionChannelLogId`, `welcomeChannelId`, `editedLogsChannelId`, `deletedLogsChannelId`: Channel IDs for various functionalities.

## Running the Bot

To start the bot, run:
```bash
node .
```

## Commands

### Utility Commands
- `/ping`: Check the bot's latency.
- `/server`: Provides information about the server.
- `/user`: Provides information about the user.
- `/avatar`: Fetches a user's avatar.
- `/gamesearch`: Initiates a search for players to join a game. Requires `game` (name of the game) and `amount` (number of players needed).
- `/duck`: Fetches a random image or gif of a duck.

### Moderation Commands
- `/purge`: Deletes a specified number of messages. Requires `amount` (number of messages to delete).
- `/mute`: Mutes a specific user. Requires `user` (the user to mute).
- `/unmute`: Unmutes a specific user. Requires `user` (the user to unmute).
- `/rename`: Renames a specific user. Requires `user` (the user to rename) and `nickname` (new nickname).
- `/addreactionrole`: Creates a new reaction role. Requires `name` (name of the role).
- `/deletereactionrole`: Deletes an existing reaction role. Requires `name` (name of the role).
- `/move`: Moves users from one voice channel to another. Requires `from` (source channel) and `to` (destination channel).

## Contributing

Contributions are welcome! Please feel free to submit pull requests or create issues for any bugs or enhancements.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.