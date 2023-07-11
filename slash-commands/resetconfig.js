const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const config = require("../config.json");
const {clientPG} = require('../database.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("resetconfig")
    .setDescription("Utiliser cette commande afin de reset la config de salons vocaux")
    .addSubcommand(sub=>{
        return sub
        .setName("all")
        .setDescription("Reset toutes les config des salons vocaux du serveur")
    })
    .addSubcommand(sub=>{
        return sub
        .setName("salon")
        .setDescription("Reset la config de un salon en particulier")
        .addChannelOption(option=>{
            return option
            .setName("salon")
            .setDescription("Choisir le salon à reset")
            .setRequired(true)
        })
    }),
    run: async(interaction)=>{
        if(interaction.options.getSubcommand()==="all"){
            await clientPG.query("delete from channels")
            return interaction.reply("Toutes les config des salons vocaux ont bien été reset");
        }
        if(interaction.options.getSubcommand()=== "salon"){
            const channel = interaction.options.getChannel("salon");
            await clientPG.query('delete from channels where channel_id = $1',[channel.id]);
            return interaction.reply(`La config du salon <#${channel.id}> a bien été reset`);
        }
    }
}