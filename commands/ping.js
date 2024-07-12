const { Client, EmbedBuilder, ActionRowBuilder } = require("discord.js");
const Discord = require("discord.js")
const settings = require("../config.json")
const mysql = require("mysql")

const fetch = require('node-fetch');
const emojis = require("../emojis.json")
module.exports = {
  name: "ping",
  description: "İlan sorgu!",
  type: 1,
  options: [],

  run: async(client, interaction) => {
    const accept = client.emojis.cache.get(emojis.onayla)
 


       
  interaction.reply(`${accept} | Şuanki bot pingi **${client.ws.ping}ms**!`)

   

    }
};