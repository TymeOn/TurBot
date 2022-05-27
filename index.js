// CONGIG
// -------
import discord from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new discord.Client({ intents: [discord.Intents.FLAGS.GUILDS] });


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


// BOT STARTUP EVENT
// -----------------
client.on('ready', () => {
    log('INFO', 'TurBot is up');
});


// BOT STARTUP
// -----------
client.login(process.env.BOT_TOKEN);
