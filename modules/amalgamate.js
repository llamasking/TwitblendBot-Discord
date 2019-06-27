/*
// Command: Amalgamate
// Description: Executes twitblend to amalgamate the two (or more?) twitter handles given.
*/

module.exports = (message, args) => {
    // Ignore messages with only one user mentioned.
    if (args[1] === undefined) {
        message.reply('this command requires at least two twitter handles.');
        return;
    }

    // Notify user command has been seen.
    message.react('👍');

    // Remove the @ from twitter handles and make them lowercase. Also sanetizes usernames.
    // @RealDonaldTrump and realdonaldtrump are considered different accounts and would have two different cache file.
    // Conserves disk space and internet as it's only saving/downloading realdonaldtrump instead of @RealDonaldTrump/RealDonaldTrump/...
    var users = ''
    for(i=args.length-1; i>-1; i--) {
        var sanetize = args[i].replace(/\W+/gmiu, '')
        var users = `${users} --username ${sanetize.toString().toLowerCase().replace(/@/, '')}`
    }

    // Runs Twitblend
    require('child_process').exec(`./virt/bin/twitblend --cache-dir ./Twitblend/cache --key-file ../api.txt --num-generated 2${users}`, (err, stdout, stderr) => {
        if (err || stderr) {
            message.reply('sorry but an error has ocurred. This may be caused by: \n\
                1. A user has a private account or doesn\'t exist,\n\
                2. A user has not tweeted in the past 30 days,\n\
                    (I *could* download every tweet a person has ever made but I won\'t.)\n\
                3. A user has blocked @TwitblendBot on Twitter, \n\
                4. Twitter didn\'t like the bot and blocked it\'s API keys,\n\
                5. Something fucked up somewhere.');
            console.error(err);
            return;
        }

        var output = stdout.replace(/\\x..|b'|RT/gm, '');
        message.channel.send(`\`\`${output}\`\``);
        }
    )
}