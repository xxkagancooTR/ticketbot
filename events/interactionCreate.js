const { Collection, EmbedBuilder } = require("discord.js");
const { readdirSync } = require("fs");
const { Player } = require('discord-player');
const { owner, nexa } = require("../config.json")

module.exports = async(client, interaction) => {

  if(interaction.isChatInputCommand()) {

    if (!interaction.guildId) return;

    readdirSync('./commands').forEach(f => {

      const cmd = require(`../commands/${f}`);

      if(interaction.commandName.toLowerCase() === cmd.name.toLowerCase()) {

        return cmd.run(client, interaction).catch(e => { console.log(e) })


      }

      


    });


  }

};