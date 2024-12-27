const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const playDL = require('play-dl'); // Usando play-dl para buscar músicas no YouTube

let queue = []; // Fila de músicas
let isPlaying = false; // Status do bot (se está tocando ou não)
let connection; // Conexão com o canal de voz
let player = createAudioPlayer(); // Player de áudio

const execute = async (client, message, args) => {
  const voiceChannel = message.member.voice.channel;

  if (!voiceChannel) {
    return message.reply('Você precisa estar em um canal de voz para tocar música!');
  }

  const songUrl = args[0];

  try {
    const song = await playDL.video_basic_info(songUrl);
    if (!song || !song.video_details) {
      return message.reply('Não foi possível encontrar informações sobre o vídeo.');
    }

    // Adiciona a música à fila
    queue.push(songUrl);

    // Se não estiver tocando, inicia o processo de reprodução
    if (!isPlaying) {
      playNextSong(voiceChannel);
    }

    message.reply(`A música foi adicionada à fila: ${song.video_details.title}`);
  } catch (error) {
    console.error('Erro ao buscar a música:', error);
    return message.reply('Houve um erro ao tentar buscar a música.');
  }
};

// Função para tocar a próxima música na fila
const playNextSong = async (voiceChannel) => {
  if (queue.length === 0) {
    isPlaying = false;
    connection.destroy(); // Destrói a conexão ao terminar a fila
    return;
  }

  const songUrl = queue.shift(); // Retira a primeira música da fila

  let stream;
  try {
    const audioStream = await playDL.stream(songUrl);
    stream = audioStream.stream;
  } catch (error) {
    console.error('Erro ao tentar obter o stream de áudio:', error);
    return;
  }

  const resource = createAudioResource(stream);

  // Se a conexão não existir ou tiver sido destruída, cria uma nova
  if (!connection || connection.destroyed) {
    connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });
  }

  // Inicia o player de áudio
  player.play(resource);

  // Quando a música terminar, chama a função recursivamente para tocar a próxima música
  player.on(AudioPlayerStatus.Idle, () => {
    playNextSong(voiceChannel);
  });

  // Assina o player para tocar no canal de voz
  connection.subscribe(player);

  isPlaying = true;
};

module.exports = {
  name: "play",
  ajuda: "Toca uma música no canal de voz e gerencia a fila.",
  execute,
};
