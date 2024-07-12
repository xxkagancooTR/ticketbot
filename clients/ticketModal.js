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
    if (!interaction.isModalSubmit()) return;
    const tick = client.emojis.cache.get(emojis.onayla)
    const cross = client.emojis.cache.get(emojis.reddet)
    if (interaction.customId === "kisiekle-modal") {

        const userid = interaction.fields.getTextInputValue("id");
        if (!interaction.member.roles.cache.get(settings.ticket.delete)) return interaction.reply({ content: `${cross} | Bunun için yetkin bulunmamakta!`, ephemeral: true })
        if (!interaction.guild.members.cache.get(userid)) return interaction.reply({ content: `${cross} | Bu kişi sunucuda bulunmamakta!`, ephemeral: true })

            await interaction.channel.permissionOverwrites.edit(userid, {
                SendMessages: true,
                ViewChannel: true
              })

              interaction.reply({ content: `${tick} | <@${userid}> adlı kişi ticketa başarıyla eklendi.`})

    } else if (interaction.customId === "kisicikar-modal") {

        const userid = interaction.fields.getTextInputValue("id");
        if (!interaction.member.roles.cache.get(settings.ticket.delete)) return interaction.reply({ content: `${cross} | Bunun için yetkin bulunmamakta!`, ephemeral: true })
        if (!interaction.guild.members.cache.get(userid)) return interaction.reply({ content: `${cross} | Bu kişi sunucuda bulunmamakta!`, ephemeral: true })

            await interaction.channel.permissionOverwrites.edit(userid, {
                SendMessages: false,
                ViewChannel: false
              })

              interaction.reply({ content: `${tick} | <@${userid}> adlı kişi başarıyla tickettan çıkarıldı.`})

    }
})