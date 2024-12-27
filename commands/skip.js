const { AudioPlayerStatus } = require('@discordjs/voice');

const execute = async (client, message, args) => {
  if (!message.member.voice.channel) {
    return message.reply('Você precisa estar em um canal de voz para pular a música!');
  }

  const player = message.client.player; // Usando a instância do player, se necessário

  if (player && player.state.status === AudioPlayerStatus.Playing) {
    player.stop(); // Para a música atual
    message.reply('A música foi pulada!');
  } else {
    message.reply('Não há música tocando no momento!');
  }
};

module.exports = {
  name: "skip",
  ajuda: "Pula a música atual na fila.",
  execute,
};
