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
const discordTranscripts = require('discord-html-transcripts');
 
client.on(`interactionCreate`, async (interaction) => {
    if (!interaction.isButton()) return;
    if (interaction.customId != "ticketyonet") return;
    const link = client.emojis.cache.get(emojis.dcgo_link)
    const nokta = client.emojis.cache.get(emojis.dcgo_nokta)
    const stat = client.emojis.cache.get(emojis.dcgo_stat)
    const tick = client.emojis.cache.get(emojis.onayla)
    const cross = client.emojis.cache.get(emojis.reddet)
    const guard = client.emojis.cache.get(emojis.guard)
    const saat = client.emojis.cache.get(emojis.saat)
    const mod = client.emojis.cache.get(emojis.mod)
    const banf = client.emojis.cache.get(emojis.ban)
    const unban = client.emojis.cache.get(emojis.unban) 
    const info = client.emojis.cache.get(emojis.dcgo_info)
    const join = client.emojis.cache.get(emojis.join)
    const leave = client.emojis.cache.get(emojis.leave)


    if (!interaction.member.roles.cache.get(settings.ticket.support)) return interaction.reply({ content: `${cross} | Bunun için yetkin bulunmamakta!`, ephemeral: true })

    const menu = new Discord.StringSelectMenuBuilder()
        .setCustomId('ticketyonetim')
        .setPlaceholder('Ticket açmak istediğiniz kategoriyi seçiniz.')
        .addOptions(
            new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Ticket Kapat')
                .setValue('ticketkapat')
                .setEmoji(`${emojis.reddet}`),
            new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Kişi Ekle')
                .setValue('kisiekle')
                .setEmoji(`${emojis.join}`),
            new Discord.StringSelectMenuOptionBuilder()
                .setLabel('Kişi Çıkar')
                .setValue('kisicikar')
                .setEmoji(`${emojis.leave}`),
        );

    const row = new Discord.ActionRowBuilder()
        .addComponents(menu);



    interaction.reply({ content: `${tick} | Menü başarıyla iletildi.`, components: [row], ephemeral: true })
})

client.on("interactionCreate", async (interaction) => {

    const stat = client.emojis.cache.get(emojis.dcgo_stat)
    const cross = client.emojis.cache.get(emojis.reddet)
    const guard = client.emojis.cache.get(emojis.guard)
    const saat = client.emojis.cache.get(emojis.saat)
    const info = client.emojis.cache.get(emojis.dcgo_info)

    if (!interaction.isStringSelectMenu()) return;

    if (interaction.customId === 'ticketyonetim') {
        let choices = "";

        interaction.values.forEach(async value => {
            choices += `${value}`
        })
        connection.query(`SELECT * FROM \`ticket\` WHERE \`channelid\` LIKE '${interaction.channel.id}'`, async function (error, results, fields) {  
            if(!results[0]?.id) return console.log("Database sorunu var!")
            if (choices == "ticketkapat") {
                const userId = results[0].id
                if (!interaction.member.roles.cache.get(settings.ticket.delete)) return interaction.reply({ content: `${cross} | Bunun için yetkin bulunmamakta!`, ephemeral: true })
                const logembed = new Discord.EmbedBuilder()
                .setAuthor({ name: "Ticket Kapatıldı", iconURL: interaction.guild.iconURL({ dynamic: true }) })
                .setColor("Red")
                .setDescription(`
                  ${stat} **Ticket Sahibi:** <@${results[0]?.id}>
                  ${guard} **Ticketi Kapatan:** ${interaction.member}
                  ${info} **Ticket Kategorisi:** **\`${results[0]?.reason}\`**
                  ${saat} **Kapatılma Saati:** <t:${Math.floor(Date.now() / 1000)}:F>`)
                  const attachment = await discordTranscripts.createTranscript(interaction.channel);
                  await interaction.guild.channels.cache.get(settings.ticket.log).send({ embeds: [logembed]})
                  await interaction.guild.channels.cache.get(settings.ticket.log).send({ files: [attachment]})
                  connection.query(`DELETE FROM ticket WHERE \`ticket\`.\`id\` = ${userId}`, async function (error, results2, fields) { await interaction.channel.delete();})
                  
                 
                  
            } else if(choices == "kisiekle") {
                const modal = new Discord.ModalBuilder()
                .setCustomId("kisiekle-modal")
                .setTitle("Kişi Ekleme Sistemi");
          
                const id = new Discord.TextInputBuilder()
                  .setCustomId("id")
                  .setLabel("Eklenecek Kişi IDsi")
                  .setPlaceholder("1184170008364982313")
                  .setMinLength(18)
                  .setMaxLength(18)
                  .setRequired(true)
                  .setStyle(Discord.TextInputStyle.Short);
          
                  const first = new Discord.ActionRowBuilder().addComponents(
                    id,
                  );
          
                  modal.addComponents(first)

                  interaction.showModal(modal).catch(e => {})
            } else if(choices == "kisicikar") {
                const modal = new Discord.ModalBuilder()
                .setCustomId("kisicikar-modal")
                .setTitle("Kişi Çıkarma Sistemi");
          
                const id = new Discord.TextInputBuilder()
                  .setCustomId("id")
                  .setLabel("Çıkarılacak Kişi IDsi")
                  .setPlaceholder("1184170008364982313")
                  .setMinLength(18)
                  .setMaxLength(18)
                  .setRequired(true)
                  .setStyle(Discord.TextInputStyle.Short);
          
                  const first = new Discord.ActionRowBuilder().addComponents(
                    id,
                  );
          
                  modal.addComponents(first)

                  interaction.showModal(modal).catch(e => {})
            }
         })



    }
})
