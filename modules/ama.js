/*
// Command: Amalgamate
// Description: Executes twitblend to amalgamate the two (or more?) twitter handles given.
*/

module.exports = (message, args) => {
    // Notify user command has been seen.
    message.react('👍');

    // Set up twitblend arguments
    var tbArgs = [
        '--cache-dir', '/tmp/',
        '--num-generated', '5',
        '--consumer-key', process.env.consumer_key,
        '--consumer-secret', process.env.consumer_secret,
        '--access-key', process.env.access_key,
        '--access-secret', process.env.access_secret
    ];
    var users = '';

    // Remove the @ from twitter handles and make them lowercase. Also sanetizes usernames.
    // '@Twitter' and 'twitter' are considered different accounts and would have two different cache files.
    // Conserves disk space and bandwidth as it's only saving/downloading 'twitter' instead of @Twitter/Twitter/@twitter...
    for (var i = 0; i < args.length; i++) {
        var sanetize = args[i].replace(/\W+/gmiu, '').toString().toLowerCase();
        tbArgs.push('--username', sanetize)

        users = `${users}, ${sanetize}`;
    }

    /* 
     * Runs TwitBlend but safely because it has no shell.
     * But actually not because Twitblend needs a shell!
     *    ______ _    _  _____ _  __  __  __ ______     _____  _____ _____ _    _ _______ ___
     *   |  ____| |  | |/ ____| |/ / |  \/  |  ____|   |  __ \|_   _/ ____| |  | |__   __|__ \
     *   | |__  | |  | | |    | ' /  | \  / | |__      | |__) | | || |  __| |__| |  | |     ) |
     *   |  __| | |  | | |    |  <   | |\/| |  __|     |  _  /  | || | |_ |  __  |  | |    / /
     *   | |    | |__| | |____| . \  | |  | | |____ _  | | \ \ _| || |__| | |  | |  | |   |_|
     *   |_|     \____/ \_____|_|\_\ |_|  |_|______( ) |_|  \_\_____\_____|_|  |_|  |_|   (_)
     *                                           |/
    */

    require('child_process').execFile('twitblend', tbArgs, { shell: true }, (err, stdout, stderr) => {
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
            message.reply(`blend of:${users} \n\`\`${output}\`\``);
        }
    });
};
