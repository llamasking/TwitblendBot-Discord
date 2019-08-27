/*
// Command: Amalgamate
// Description: Executes twitblend to amalgamate the two (or more?) twitter handles given.
*/

module.exports = (message, args) => {
    if (args.indexOf('https://twitter.com/') != -1) {
        message.channel.send("Sorry, but twitter urls are not yet supported. This is because I'm lazy. I'll probably get to it later.")
        return;
    }
    
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
    require('child_process').exec(`twitblend --cache-dir /tmp/ --key-file ./api.txt --num-generated 4${users}`, (err, stdout, stderr) => {
        if (err || stderr) {
            message.channel.send('Sorry but an error has ocurred. This may be caused by: \n\
                1. A user has a private account or doesn\'t exist,\n\
                2. A user has not tweeted,\n\
                3. A user has blocked @TwitblendBot on Twitter, \n\
                4. Twitter didn\'t like the bot and revoked it\'s API keys,\n\
                5. Something else fucked up somewhere.');
            console.error(err);
        } else {
            var output = stdout.replace(/\\x..|b'|RT|\\n/gm, '');
            message.reply(`Blend of ${args}: \n\`\`${output}\`\``);
        };
    });
};
