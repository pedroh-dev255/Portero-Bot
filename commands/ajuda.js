const { EmbedBuilder } = require("discord.js");

const execute = (bot, msg, args) => {
  let string = "**===== LISTA DE COMANDOS =====**\n\n";
  bot.commands.forEach((command) => {
    if (command.ajuda) {
      string += `**${process.env.PREFIX}${command.name}** : ${command.ajuda};\n\n`;
    }
  });

  const embed = new EmbedBuilder()
    .setTitle(`AJUDA (●'◡'●)`)
    .setColor(`#FC0FC0`)
    .setDescription(string);

  return msg.channel.send({ embeds: [embed] });
};

module.exports = {
  name: "ajuda",
  ajuda: "Exibe o guia de todos os comandos",
  execute,
};
