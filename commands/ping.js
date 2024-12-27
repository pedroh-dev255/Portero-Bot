const execute = async (client, message, args) => {
    const m = await message.channel.send('ping?');
    
    m.edit(`🏓 **| Pong!**\nLatência do Server: **${m.createdTimestamp -
        message.createdTimestamp}ms.**\nLatência da API: **${Math.round(
        client.ws.ping
      )}ms**`
    );
  };
  
  module.exports = {
    name: "ping",
    ajuda: "Mostro a minha latencia em relação ao server",
    execute,
  };