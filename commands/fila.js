const execute = (client, message, args) => {
    if (queue.length === 0) {
      return message.reply('A fila de músicas está vazia.');
    }
  
    let queueMessage = '**Fila de músicas:**\n\n';
    queue.forEach((song, index) => {
      queueMessage += `${index + 1}. ${song}\n`;
    });
  
    message.reply(queueMessage);
  };
  
  module.exports = {
    name: "fila",
    ajuda: "Exibe a fila de músicas.",
    execute,
  };
  