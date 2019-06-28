/*
// Command: Help
// Description: Supplying a list of bot commands.
*/

const Discord = require("discord.js");

module.exports = (message, args) => {
    var embed = new Discord.RichEmbed()
        .setTitle("Commands")
        .addField("!!help / commands", "This command.")
        .addField("!!ama / amalgamate [User1] [User2]...", "Creates an amalgamtion of two or more people's tweets using Markov chains.")
        .addField("!!credits", "Thanks so much, Wildcard0!")
        .addField("!!ping", "How shitty is my DSL internet today?")
        .setImage("https://raw.githubusercontent.com/llamasking/badboi/master/assets/rainbow.gif")
        .setColor(0x7289DA)
        .setFooter("If you ever run into issues, feel free to join the support server. https://discord.gg/zFxjHYp")
    message.channel.send({embed});
}