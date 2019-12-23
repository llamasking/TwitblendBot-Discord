/*
// Command: Amalgamate
// Description: Executes twitblend to amalgamate the two (or more?) twitter handles given.
*/

module.exports = (message, args) => {
    // Notify user command has been seen.
    message.react('👍');

    // Parse API keys and secrets.
    const _consumerKey = process.env.consumer_key;
    const _consumerSecret = process.env.consumer_secret;
    const _access_key = process.env.access_key;
    const _access_secret = process.env.access_secret;
    const apiKeys = `--consumer-key ${_consumerKey} --consumer-secret ${_consumerSecret} --access-key ${_access_key} --access-secret ${_access_secret}`;

    // Remove the @ from twitter handles and make them lowercase. Also sanetizes usernames.
    // '@Twitter' and 'twitter' are considered different accounts and would have two different cache files.
    // Conserves disk space and internet as it's only saving/downloading 'twitter' instead of @Twitter/twitter/...
    var users = '';
    for (i = args.length - 1; i > -1; i--) {
        var sanetize = args[i].replace(/\W+/gmiu, '').toString().toLowerCase();
        var users = `${users} --username ${sanetize}`;
    };

    // Runs Twitblend
    require('child_process').exec(`twitblend ${apiKeys} --num-generated 4${users}`, (err, stdout, stderr) => {
        if (err || stderr) {
            message.channel.send('Sorry but an error has ocurred. This may be caused by: \n\
                1. A user has a private account or doesn\'t exist,\n\
                2. A user has not tweeted,\n\
                3. A user has blocked @TwitblendBot on Twitter, \n\
                4. Twitter didn\'t like the bot and revoked it\'s API keys,\n\
                5. You gave a url. I\'ll be honest. I can fix it and probably will later, just not now.\n\
                6. Something else fucked up somewhere.');
            console.error(err);
        } else {
            var output = stdout.replace(/\\x..|b'|RT|\\n|\\|'|"|b"/gm, '');
            message.reply(`blend of: ${args} \n\`\`${output}\`\``);
        };
    });
};
