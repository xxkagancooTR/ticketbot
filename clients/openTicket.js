const settings = require('../config.json');
const emojis = require("../emojis.json")
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: settings.mysql.host,
    user: settings.mysql.user,
    database: settings.mysql.database
});
const client = require("../main");
const Discord = require("discord.js")

client.on("interactionCreate", async (interaction) => {
   
  const stat = client.emojis.cache.get(emojis.dcgo_stat)
  const tick = client.emojis.cache.get(emojis.onayla)
  const cross = client.emojis.cache.get(emojis.reddet)

    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'ticketmenu') {
      let choices = "";

     interaction.values.forEach(async value => {
      choices += `${value}`
    })


    connection.query(`SELECT * FROM \`ticket\` WHERE \`id\` LIKE '${interaction.member.id}'`, async function (error, results, fields) { 
      if(results[0]?.id) return interaction.reply({ content: `${cross} | Zaten açık bir talebiniz bulunuyor!`, ephemeral: true })
      const channel = await interaction.guild.channels.create({
          name: `ticket-${interaction.member.displayName}`,
        type: Discord.ChannelType.GuildText,
        parent: settings.ticket.parent,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [
              Discord.PermissionFlagsBits.ViewChannel
            ]
          },
          {
            id: interaction.user.id,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.AttachFiles,
              Discord.PermissionFlagsBits.EmbedLinks,
              Discord.PermissionFlagsBits.AddReactions
            ]
          },
          {
            id: settings.ticket.support,
            allow: [
              Discord.PermissionFlagsBits.ViewChannel,
              Discord.PermissionFlagsBits.SendMessages,
              Discord.PermissionFlagsBits.AttachFiles,
              Discord.PermissionFlagsBits.EmbedLinks,
              Discord.PermissionFlagsBits.AddReactions
            ]
          }
        ]
    });

    let reason;
    if(choices == "oyuncusikayet") reason = "Oyuncu Şikayet"
    if(choices == "yetkilisikayet") reason = "Yetkili Şikayet"
    if(choices == "malvarliktalebi") reason = "Malvarlık Talebi"
    if(choices == "banserialdegisimi") reason = "Ban/Serial Değişimi"
    if(choices == "diger") reason = "Diğer"

    const embed = new Discord.EmbedBuilder()
    .setAuthor({ name: "Ticket Sistemi", iconURL: interaction.guild.iconURL({ dynamic: true }) })
    .setDescription(`${stat} ${interaction.member}, **${reason}** kategorisindeki talebiniz oluşturuldu!`)

    const button = new Discord.ButtonBuilder()
    .setCustomId(`ticketyonet`)
    .setLabel(`Yönetim Paneli`)
    .setStyle(Discord.ButtonStyle.Danger)
    .setEmoji(`1197098533233360927`)

    const row = new Discord.ActionRowBuilder()
    .addComponents(button);

    channel.send({ content: `<@&${settings.ticket.support}> & ${interaction.member}`, embeds: [embed], components: [row]})
    interaction.reply({ content: `${tick} | ${interaction.member}, ticket kanalınız başarıyla açıldı! (${channel})`, ephemeral: true })

    connection.query(`INSERT INTO \`ticket\` (\`id\`, \`channelid\`, \`date\`, \`reason\`) VALUES ('${interaction.member.id}', '${channel.id}', '${Date.now()}', '${reason}');`, async function (error, results, fields) { })


  })


  }

 
    
})

