const { Command } = require('klasa');
const ModLog = require('../../util/modlog');

module.exports = class extends Command {

    constructor(...args) {
        super(...args, {
            name: 'ban',
            permLevel: 2,
            botPerms: ['BAN_MEMBERS'],
            runIn: ['text'],

            description: 'Bans the mentioned member.',
            usage: '<user:user> [reason:string] [...]',
            usageDelim: ' '
        });
    }

    async run(msg, [user, ...reason]) {
        reason = reason.length > 0 ? reason.join(' ') : null;

        const member = await msg.guild.members.fetch(user).catch(() => null);

        if (!member);
        else if (member.highestRole.position >= msg.member.highestRole.position) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_BAN_FAIL_POSITION')}.`);
        } else if (member.bannable === false) {
            return msg.send(`${msg.language.get('DEAR')} ${msg.author}, ${msg.language.get('COMMAND_BAN_FAIL_BANNABLE')}.`);
        }

        await msg.guild.ban(user, { reason });

        if (msg.guild.configs.modlog) {
            new ModLog(msg.guild)
                .setType('ban')
                .setModerator(msg.author)
                .setUser(user)
                .setReason(reason)
                .send();
        }

        return msg.send(`${msg.language.get('COMMAND_BAN_SUCCESS')} ${user.tag}${reason ? `\n${msg.language.get('COMMAND_BAN_REASON')}: ${reason}` : ''}`);
    }

};
