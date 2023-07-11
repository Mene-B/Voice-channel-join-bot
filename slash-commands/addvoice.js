const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const config = require("../config.json");
const {clientPG} = require('../database.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("configvoicechannel")
    .setDescription("Utiliser cette commande pour ajouter l'obtention d'un role lors de l'arrivé dans un salon vocal")
    .addChannelOption(option=>{
        return option
        .setName("salon")
        .setDescription("Choisir le salon")
        .setRequired(true)
    }) 
    .addRoleOption(option=>{
        return option
        .setName("role")
        .setDescription("Choisir le role à ajouter")
        .setRequired(true)
    }),
    run: async(interaction)=>{
        if(!interaction.member.roles.cache.has(config.allowedRoleId)){
            return interaction.reply({content: "Vous ne pouvez pas utiliser cette commande", ephemeral: true})
        }
        const channel = interaction.options.getChannel("salon");
        const role = interaction.options.getRole("role");
        if(channel.type !== 2){
            return interaction.reply({content: "Veuillez choisir un salon vocal uniquement svp", ephemeral: true})
        }
        if((await clientPG.query('select * from channels where channel_id = $1',[channel.id])).rows.length > 0 ){
            return interaction.reply({content: "Ce salon est déjà configuré", ephemeral: true})
        }
        await clientPG.query('insert into channels values($1,$2)',[channel.id, role.id]);
        return interaction.reply(`Le salon <#${channel.id}> a bien été configuré avec le role <@&${role.id}>.`)
    }
}