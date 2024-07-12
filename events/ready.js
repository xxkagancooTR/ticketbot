const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v10");
const { TOKEN, TOKEN2, token } = require("../token.json");

const { addleavechannel, developer, mongourl } = require("../config.json");

module.exports = async (client) => {


  const rest = new REST({ version: "10" }).setToken(token);
  try {
    await rest.put(Routes.applicationCommands(client.user.id), {
      body: client.commands,
    });
  } catch (error) {
    console.error(error);
  }

    console.log(`${client.user.tag} Active!`);

    client.user.setPresence({
      activities: [{ name: `xxkagancooTR`}],
      status: 'idle',
    });
};

