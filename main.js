const Discord = require("discord.js");
const client = new Discord.Client({intents:[
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildVoiceStates
]})
const config = require("./config.json");
const { clientPG } = require("./database");
const fs = require('fs');


client.login(config.token);

client.on("ready", ()=>{
    console.log("Bot ready to work hard !")
})

client.on("voiceStateUpdate",async(oldState, newState)=>{
    const channelJoined = newState.channel;
    const channelLeft = oldState.channel;

    const channels = (await clientPG.query('select * from channels')).rows;
    const channelIDs = channels.map(channel => {
        return channel.channel_id;
    })
    if(channelIDs.includes(channelJoined?.id)){
        const roleId = channels.find(channel => channel.channel_id === channelJoined.id).role_id;
        newState.member.roles.add(roleId);
    }
    if(channelIDs.includes(channelLeft?.id)){
        const roleId = channels.find(channel => channel.channel_id === channelLeft.id).role_id;
        newState.member.roles.remove(roleId);
    }
})
const commands = fs.readdirSync("./slash-commands").map((fileName)=>{
    const command = require("./slash-commands/"+fileName);
    return {name: command.data.name, run: command.run}
})

client.on("interactionCreate", (interaction)=>{
    if (interaction.isCommand()){
        const command = commands.find((cmd)=>{
            return interaction.commandName === cmd.name;
        })
        command.run(interaction);
    }
})