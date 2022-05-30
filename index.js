// CONGIG
// -------
import discord, { TextChannel } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS] });
const CONST_PREFIX = '!t ';

let channels = {
    'master': null,
    'ac': null,
    'bc': null,
    'ca': null,
    'cb': null
}


// LOG
// ---
function log(level, message, detail = '') {
    // log color
    let color = '\x1b[37m%s\x1b[0m';
    if (level == 'WARN') {
        color = '\x1b[33m%s\x1b[0m';
    } else if (level == 'ERROR') {
        color = '\x1b[31m%s\x1b[0m';
    }

    // log timestamp
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
    const day = (now.getDate() < 10 ? '0' : '') + now.getDate();
    const hours = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const timestamp = '(' + year + '-' + month + '-' + day + ' ' + hours + ':' + mins + ':' + secs + ')';

    // actual log
    console.log(
        color,
        '[' + level + '] ' + timestamp + ' ' + message + ' ' + detail
    );
}


// IS READY
// --------
function isReady() {
    return (channels['master'] &&
            channels['ac'] &&
            channels['bc'] &&
            channels['ca'] &&
            channels['cb']
    )
}


// REMOVE DUPLICATE
// ----------------
function removeDuplicate(channel) {
    for (let key in channels) {
        if (channels.hasOwnProperty(key) && channels[key] === channel) {
            channels[key] = null;
        }
    }
}


// SEND A MESSAGE TO ONE OR MORE CHANNELS
// --------------------------------------
function sendMessage(channelNames, message) {
    channelNames.forEach((cName) => {
        channels[cName].send(message);
    });
}


// BOT STARTUP EVENT
// -----------------
client.on('ready', () => {
    log('INFO', 'TurBot is up');
});


// MESSAGE RECEIVED EVENT
// --------------------
client.on('message', (message) => {

    // check if the command is adressed to the bot (and not by itself)
    if (message.author.bot) return;
    if (!message.content.startsWith(CONST_PREFIX)) return;

    // getting the command and its arguments
    const commandBody = message.content.slice(CONST_PREFIX.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    // HELP COMMAND
    // ------------
    if (command === 'help') {

    }

    // SET COMMAND
    // -----------
    else if (command === 'set') {
        if(args[0]) {
            if(message.channel.type === 'text') {
                if(args[0] === 'master' ||
                    args[0] === 'ac' ||
                    args[0] === 'bc' ||
                    args[0] === 'ca' ||
                    args[0] === 'cb'
                ) {
                    removeDuplicate(message.channel);
                    channels[args[0]] = message.channel;
                    log('INFO', 'Channel "' + args[0] + '" (' + message.channel.name + ') registered by ' + message.author.tag);
                    message.channel.send(':white_check_mark: <#' + message.channel + '> registered as channel "' + args[0] + '".');
                } else {
                    log('WARN', 'Channel registration with unknown channel parameter "' + args[0] + '" (' + message.channel.name + ') by ' + message.author.tag);
                    message.channel.send(':x: Error: unknown parameter.');
                }
            } else {
                log('WARN', 'Channel registration in incorrect channel type (' + message.channel.name +' -> ' + message.channel.type + ') by ' + message.author.tag);
                message.channel.send(':x: Error: only server text channels can be registered.');
            }
        } else {
            log('WARN', 'Channel registration without channel parameter by ' + message.author.tag);
            message.channel.send(':x: Error: please input a channel parameter.');
        }
    }

    // STATUS COMMAND
    // -----------
    else if (command === 'status') {
        log('INFO', 'Status requested by ' + message.author.tag);

        const answerEmbed = new discord.MessageEmbed()
            .setColor(isReady() ? '#27f549' : '#f53527')
            .setTitle('TurBot Status')
            .addFields(
                { name: 'Master Channel', value: channels['master'] ?? 'Missing' },
                { name: 'A -> C Channel', value: channels['ac'] ?? 'Missing' },
                { name: 'B -> C Channel', value: channels['bc'] ?? 'Missing' },
                { name: 'C -> A Channel', value: channels['ca'] ?? 'Missing' },
                { name: 'C -> B Channel', value: channels['cb'] ?? 'Missing' },
                { name: 'Global status', value: isReady() ? 'Ready' : 'Not Ready' }
            )
            .setFooter(message.author.username, message.author.avatarURL())
            .setTimestamp();

        message.channel.send(answerEmbed);
    }

    // RESET COMMAND
    // -----------
    else if (command === 'reset') {
        log('INFO', 'Reset requested by ' + message.author.tag);
        channels = {
            'master': null,
            'ac': null,
            'bc': null,
            'ca': null,
            'cb': null
        };
    }

    // START COMMAND
    // -----------
    else if (command === 'start') {
        if(isReady()) {
            sendMessage(['master', 'ac', 'bc', 'ca', 'cb'], 'TEST STARTED');
        } else {
            log('WARN', 'Test start failed: channels missing (requested by ' + message.author.tag + ')');
            message.channel.send(':x: Error: one or more channels are missing.');
        }
    }

    // STOP COMMAND
    // -----------
    else if (command === 'stop') {
        
    }

});


// BOT STARTUP
// -----------
client.login(process.env.BOT_TOKEN);
