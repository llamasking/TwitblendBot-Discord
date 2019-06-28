/*
// Command: Amalgamate
// Description: Executes twitblend to amalgamate the two (or more?) twitter handles given.
*/

module.exports = (message, args) => {
    const fs = require("fs");

    // Notify user command has been seen.
    message.react('👍');

    // Remove the @ from twitter handles and make them lowercase. Also sanetizes usernames.
    // @RealDonaldTrump and realdonaldtrump are considered different accounts and would have two different cache file.
    // Conserves disk space and internet as it's only saving/downloading realdonaldtrump instead of @RealDonaldTrump/RealDonaldTrump/...
    var users = '';
    for(i=args.length-1; i>-1; i--) {
        var sanetize = args[i].replace(/\W+/gmiu, '').toString().toLowerCase();
        var users = `${users} --username ${sanetize}`;
    };

    // Runs Twitblend
    require('child_process').exec(`./virt/bin/twitblend --cache-dir ./cache --key-file ./api.txt --num-generated 2${users}`, (err, stdout, stderr) => {
        if (err || stderr) {
            message.reply('sorry but an error has ocurred. This may be caused by: \n\
                1. A user has a private account or doesn\'t exist,\n\
                2. A user has not tweeted in the past 30 days,\n\
                3. A user has blocked @TwitblendBot on Twitter, \n\
                4. Twitter didn\'t like the bot and blocked it\'s API keys,\n\
                5. Something else fucked up somewhere.');
            console.error(err);
        } else {
            var output = stdout.replace(/\\x..|b'|RT|\\n/gm, '');
            message.reply(`${args}: \n\`\`${output}\`\``);
        };
    });
};