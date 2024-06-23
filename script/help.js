const axios = require('axios');

module.exports.config = {
    name: 'help',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    aliases: ['help'],
    description: "Beginner's guide",
    usage: "Help [page] or [command]",
    credits: 'Developer',
};

module.exports.run = async function ({ api, event, enableCommands, args, Utils, prefix }) {
    const input = args.join(' ');

    try {
        const eventCommands = enableCommands[1].handleEvent;
        const commands = enableCommands[0].commands;

        const fetchRandomBibleVerse = async () => {
            try {
                const response = await axios.get('https://deku-rest-api-gadz.onrender.com/bible');
                return `📖 ${response.data.verse}\n- ${response.data.reference}`;
            } catch (error) {
                console.error('Error fetching Bible verse:', error);
                return 'An error occurred while fetching the Bible verse.';
            }
        };

        const randomBibleVerse = await fetchRandomBibleVerse();

        if (!input) {
            const pages = 999;
            let page = 1;
            let start = (page - 1) * pages;
            let end = start + pages;
            let helpMessage = `\n\n====『 🖥️𝙎𝙞𝙢𝙥𝙡𝙚 𝙘𝙝𝙖𝙩𝙗𝙤𝙩 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 』====\n▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n♡  ∩_∩\n（„• ֊ •„)♡\n╭─∪∪───────────⟡`;
            for (let i = start; i < Math.min(end, commands.length); i++) {
                helpMessage += `\n├ ✧『 ${i + 1} 』  ${prefix}${commands[i]}\n├──────────────⟡\t`;
            }
            helpMessage += '\n\n====『𝗙𝗘𝗔𝗧𝗨𝗥𝗘 𝗟𝗜𝗦𝗧』====\n▱▱▱▱▱▱▱▱▱▱▱▱▱\n\n';
            eventCommands.forEach((eventCommand, index) => {
                helpMessage += `╭─────────────────╮\n |\t『 ${index + 1}.』  ${prefix}${eventCommand}\n╰─────────────────╯ \n\n`;
            });
            helpMessage += `𝗣𝗮𝗴𝗲: 『${page}/${Math.ceil(commands.length / pages)}』\nTo view information about a specific command, type '${prefix}help command name.\n\n𝗥𝗔𝗡𝗗𝗢𝗠 𝗕𝗜𝗕𝗟𝗘 𝗩𝗘𝗥𝗦𝗘:\n${randomBibleVerse}`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else if (!isNaN(input)) {
            const page = parseInt(input);
            const pages = 100;
            let start = (page - 2) * pages;
            let end = start + pages;
            let helpMessage = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧:\n\n`;
            for (let i = start; i < Math.min(end, commands.length); i++) {
                helpMessage += `\t${i + 1}. 『 ${prefix}${commands[i]} 』\n`;
            }
            helpMessage += '\n𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦𝗧:\n\n';
            eventCommands.forEach((eventCommand, index) => {
                helpMessage += `\t${index + 1}. 『 ${prefix}${eventCommand} 』\n`;
            });
            helpMessage += `\nPage ${page} of ${Math.ceil(commands.length / pages)}\n\n𝗥𝗔𝗡𝗗𝗢𝗠 𝗕𝗜𝗕𝗟𝗘 𝗩𝗘𝗥𝗦𝗘:\n${randomBibleVerse}`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } else {
            const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
            if (command) {
                const {
                    name,
                    version,
                    role,
                    aliases = [],
                    description,
                    usage,
                    credits,
                    cooldown,
                    hasPrefix
                } = command;
                const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: user' : (role === 1 ? '➛ Permission: admin' : (role === 2 ? '➛ Permission: thread Admin' : (role === 3 ? '➛ Permission: super Admin' : '')))) : '';
                const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
                const descriptionMessage = description ? `Description: ${description}\n` : '';
                const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
                const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
                const versionMessage = version ? `➛ Version: ${version}\n` : '';
                const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
                const message = ` 「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
                api.sendMessage(message, event.threadID, event.messageID);
            } else {
                api.sendMessage('The command wasn't found on 𝙎𝙞𝙢𝙥𝙡𝙚 𝙘𝙝𝙖𝙩𝙗𝙤𝙩 .', event.threadID, event.messageID);
            }
        }
    } catch (error) {
        console.log(error);
    }
};
