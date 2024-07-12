const { Client, Intents, GatewayIntentBits, Partials, Collection, Events, ButtonBuilder, TextInputBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js");
const wait = require('node:timers/promises').setTimeout;
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.MessageContent
],
partials: [Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction]
});

global.client = client;
module.exports = client;
client.commands = (global.commands = []);

const { readdirSync, createReadStream, createWriteStream, unlinkSync  } = require("fs")
const { token } = require("./token.json");
const settings = require("./config.json")
const emojis = require("./emojis.json")
const { entersState, NoSubscriberBehavior, getVoiceConnection, joinVoiceChannel, VoiceConnectionStatus, createAudioResource, StreamType, createAudioPlayer } = require('@discordjs/voice')

readdirSync('./commands').forEach(f => {
  if(!f.endsWith(".js")) return;

 const props = require(`./commands/${f}`);

 client.commands.push({
       name: props.name.toLowerCase(),
       description: props.description,
       options: props.options,
       dm_permission: props.dm_permission,
       type: 1
 });

console.log(`${props.name} command loaded!`)

});






readdirSync('./events').forEach(e => {

  const eve = require(`./events/${e}`);
  const name = e.split(".")[0];

  client.on(name, (...args) => {
            eve(client, ...args)
        });

console.log(`${name} event loading!`)

});

readdirSync('./clients').forEach(e => {

  const name = e.split(".")[0];

  require(`./clients/${e}`)

console.log(`${name} client loaded!`)

});


client.on('ready', async () => {
  const voiceChannel = client.channels.cache.get(settings.seskanali); 


  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator
  });

  try {
    await connection;
    console.log('Ses kanalına başarıyla katıldım!');
  } catch (error) {
    console.error(error);
    console.log('Ses kanalına katılamadım!');
  }

});

client.login(token)

client.on("messageCreate", async (message) => {
  if(message.content != "sa bi menü alayim mi") return;
  if(message.member.id != settings.owner) return;
  const link = client.emojis.cache.get(emojis.dcgo_link)
  const embed = new Discord.EmbedBuilder()
  .setAuthor({ name: "Ticket Sistemi", iconURL: message.guild.iconURL({ dynamic: true }) })
  .setDescription(`
    ${link} **Merhaba, aşağıdaki menüden sorununa göre ticket açabilirsin.**
    `) 


		const menu = new Discord.StringSelectMenuBuilder()
			.setCustomId('ticketmenu')
			.setPlaceholder('Ticket açmak istediğiniz kategoriyi seçiniz.')
			.addOptions(
				new Discord.StringSelectMenuOptionBuilder()
					.setLabel('Oyuncu Şikayet')
					.setValue('oyuncusikayet')
          .setEmoji(`${emojis.guard}`),
				new Discord.StringSelectMenuOptionBuilder()
					.setLabel('Yetkili Şikayet')
					.setValue('yetkilisikayet')
          .setEmoji(`${emojis.mod}`),
				new Discord.StringSelectMenuOptionBuilder()
					.setLabel('Malvarlık Talebi')
					.setValue('malvarliktalebi')
          .setEmoji(`${emojis.dcgo_info}`),
          new Discord.StringSelectMenuOptionBuilder()
					.setLabel('Ban/Serial Değişimi')
					.setValue('banserialdegisimi')
          .setEmoji(`${emojis.ban}`),
          new Discord.StringSelectMenuOptionBuilder()
					.setLabel('Diğer')
					.setValue('diger')
          .setEmoji(`${emojis.dcgo_stat}`),
			);

		const row = new ActionRowBuilder()
			.addComponents(menu);

    message.channel.send({ embeds: [embed], components: [row]})
})

