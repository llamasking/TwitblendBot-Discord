/*
// Command: Credits
// Description: Print credits for the bot.
*/
const Discord = require('discord.js');

module.exports = (message) => {
    var embed = new Discord.RichEmbed()
        .setTitle('Credits')
        .addField('→ Wildcard0: https://github.com/wildcard0/', 'Created Twitblend, the program used to amalgamate tweets. ')
        .addField('→ llamasking: https://github.com/llamasking/', 'Creator and host of both the Discord and Twitter bots.')
        .setColor(0x7289DA)
        .setFooter('If you ever run into issues, feel free to join the support server. https://discord.gg/zFxjHYp');
    message.channel.send({ embed });
};