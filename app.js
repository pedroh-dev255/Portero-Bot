// app.js
const express = require('express');
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const bot = new Client({
  intents: 
  [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

bot.commands = new Collection();
bot.queues = new Map(); // Map para filas de música ou outras funcionalidades

// Carrega os comandos dinamicamente
const commandFiles = fs
  .readdirSync(path.join(__dirname, 'commands'))
  .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  bot.commands.set(command.name, command);
}

console.log(`Comandos carregados: ${[...bot.commands.keys()].join(', ')}`);


// Servidor Express para manter o bot online e verificar status
app.get('/', (req, res) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3); // Ajusta para o fuso horário desejado
  console.log(`Ping recebido às ${ping.toISOString()}`);
  res.send('Bot está online!');
});

app.listen(process.env.PORT, () => 
  console.log(`Servidor Express rodando na porta ${process.env.PORT}`)
);

// Evento quando o bot está pronto
bot.once('ready', () => {
  console.log(`✅ Bot online como ${bot.user.tag}`);
  setBotStatus();
});

// Evento para mensagens
bot.on('messageCreate', async message => {
  if (!message.content.startsWith(process.env.PREFIX) || message.author.bot) return;

  const args = message.content.slice(process.env.PREFIX.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = bot.commands.get(commandName);
  if (!command) {
    message.reply('❌ Comando não encontrado!');
    return;
  }

  try {
    await command.execute(bot, message, args);
  } catch (error) {
    console.error(error);
    message.reply('❌ Houve um erro ao executar este comando.');
  }

  bot.on('messageCreate', (message) => {
    console.log(`Mensagem recebida: ${message.content}`);
  });
  
});

// Função para configurar o status do bot
function setBotStatus() {
    const activities = [
      { name: 'Dora Aventureira', type: 'WATCHING' },
      { name: 'as vozes da minha cabeça', type: 'LISTENING' },
      { name: 'Minecraft', type: 'PLAYING' },
    ];
  
    let currentIndex = 0;
  
    setInterval(() => {
      const activity = activities[currentIndex++ % activities.length];
      bot.user.setActivity(activity.name, { type: activity.type });
    }, 10000); // Alterna status a cada 10 segundos
  }

// Login do bot
bot.login(process.env.TOKEN).catch(error => {
  console.error('Erro ao tentar logar no Discord:', error);
});
