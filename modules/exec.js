/*
// Command: Exec
// Description: Executes a command in sh. 
*/
const config = require('../config.json')

module.exports = (message, args) => {
    // Check for bot host ID.
    if (message.author.id != config.ownerID) return;

    // Notify user command has been seen.
    message.react('👍');

    // Runs Twitblend
    require('child_process').exec(message.content.slice(7), (err, stdout, stderr) => {
        if (err || stderr) {
            message.channel.send(`Error! \`\`\`${stderr}\`\`\``);
            console.error(err);
        } else {
            message.reply(`\`\`\`${stdout}\`\`\``);
        };
    });
};
