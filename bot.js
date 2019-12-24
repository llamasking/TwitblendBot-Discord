// Load and prep Discord and client.
const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

/* 
 * Config.json is not used anymore.
 * Use Config Vars in Heroku instead.
 * You *can* use it instead if you really want to for some reason.
 * 
 * const config = require('./config.json');
 */

// Use Heroku Config Vars for 
const config = process.env;

// Load activated modules
const activated = require('./activated.json');

// Load framework
const hashthis = require('./framework/hashthis.js')
const execcmd = require('./framework/exec.js')
const log = require('./framework/logging.js');

// Starting up!
log('Bot starting up!')

// Detect modules
var modhash = [];
const mods = fs.readdirSync('./modules', 'utf-8');
for (var i = 0; i < mods.length; i++) {
  modhash[i] = hashthis(fs.readFileSync('./modules/' + mods[i]));
  log(`Detected Module: ${mods[i]} - Hash: ${modhash[i]} - Activated: ${activated[mods[i].replace('.js', '')]}`);
}

// Loadmod function
function loadmod(command, args, message) {
  // Ignore disabled modules
  if (activated[command] == undefined || false) return;

  var x = require(`./modules/${command}.js`);
  x(message, args)
}

// Overall hash of everything
const botjshash = hashthis(fs.readFileSync('./bot.js'));
const totalhash = hashthis(modhash.toString() + botjshash);

client.on("ready", () => {
  console.log(`
    Logged in as ${client.user.username}.
    Bot.js hash: ${botjshash}
    Total hash: ${totalhash}
    Time: ${new Date()}
    Serving ${client.guilds.size} servers with ${client.users.size} users.\n`);

  // Activity is hard coded in because I don't feel like plugging it into heroku.
  client.user.setActivity('with words', { type: "PLAYING" });
});

client.on("guildCreate", guild => { log(`Joined new server: ${guild.name} with ${guild.memberCount} members.`) });
client.on("guildDelete", guild => { log(`Left server: ${guild.name} with ${guild.memberCount} members.`) });

client.on("message", async message => {
  // Cut out bots and group chats/dms.
  if (message.author.bot) return;
  if (message.guild === null) return;

  // @Bot *help* and @Bot *commands*
  if (message.isMentioned(client.user.id) && message.content.includes("help" || "commands")) loadmod('help');

  // Cut out commands not starting with prefix.
  if (!message.content.startsWith(config.prefix)) return;

  // Split into args and cmd
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();

  switch (cmd) {
    // ONLY FOR USE WITH COMMANDS THAT DO NOT PLAY WELL AS A MODULE

    case "exec": {
      if (message.author.id == config.ownerID) {
        execcmd(message);
      } else {
        // OwnerID does not match message author. Do nothing.
      }
      break;
    }

    case "ping": {
      // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
      // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
      const m = await message.channel.send("Testing ping!");
      m.edit(`Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
      break;
    }

    // Load from module if command plays well in a module
    default: {
      loadmod(cmd, args, message)
    }
  }

  // Logging <READ THE TERMS ON THE GITHUB REPO FOR MORE INFO>
  log(`Command: ${cmd} -- Arguments: ${args}`)
});

client.login(config.discord_token);
