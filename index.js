import 'dotenv/config';
import fs from 'fs';
import express from 'express';
import { Client, GatewayIntentBits, Collection } from 'discord.js';

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
client.commands = new Collection();

// Komutları yükle
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
    const command = await import(`./commands/${file}`);
    if (command.default.data) client.commands.set(command.default.data.name, command.default);
}

// Prefix komut ve slash komut
client.on('messageCreate', async message => {
    if (!message.content.startsWith('n!') || message.author.bot) return;
    const args = message.content.slice(2).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName);
    if (!command) return;
    if (command.execute) command.execute(message, args, client);
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command || !command.executeSlash) return;
    command.executeSlash(interaction, client);
});

// Web server
const app = express();
app.get('/', (req, res) => res.send('Bot Aktif!'));
app.listen(process.env.PORT || 3000, () => console.log('Web server çalışıyor.'));

// Bot login
client.login(process.env.DISCORD_TOKEN);
