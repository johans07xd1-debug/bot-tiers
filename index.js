const { Client, GatewayIntentBits, EmbedBuilder, SlashCommandBuilder, REST, Routes } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// REEMPLAZA ESTOS DOS VALORES CON TUS DATOS:
const TOKEN = 'MTU1OTY5MjAyODg1MjMxMDEzOA.GXLevW.fhgtCNlW0iKQLh2C0EUwNmfgLYHi4A-fBOvj7Y'; 
const CLIENT_ID = '1559692028852310138'; 

const command = new SlashCommandBuilder()
    .setName('resultado')
    .setDescription('Genera la tarjeta de resultado de testeo')
    .addUserOption(opt => opt.setName('tester').setDescription('Usuario tester').setRequired(true))
    .addStringOption(opt => opt.setName('region').setDescription('Región').setRequired(true))
    .addStringOption(opt => opt.setName('username').setDescription('Usuario de Minecraft').setRequired(true))
    .addStringOption(opt => opt.setName('previous_rank').setDescription('Rango anterior').setRequired(true))
    .addStringOption(opt => opt.setName('rank_earned').setDescription('Rango obtenido').setRequired(true))
    .addStringOption(opt => opt.setName('thumbnail_url').setDescription('URL de la imagen/skin').setRequired(false));

const rest = new REST({ version: '10' }).setToken(TOKEN);

(async () => {
    try {
        console.log('Registrando comando /resultado...');
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: [command.toJSON()] });
        console.log('¡Comando registrado con éxito!');
    } catch (error) {
        console.error('Error al registrar comando:', error);
    }
})();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'resultado') {
        const tester = interaction.options.getUser('tester');
        const region = interaction.options.getString('region');
        const username = interaction.options.getString('username');
        const previousRank = interaction.options.getString('previous_rank');
        const rankEarned = interaction.options.getString('rank_earned');
        const thumbnailUrl = interaction.options.getString('thumbnail_url') || 'https://i.imgur.com/8N4X0qE.png';

        const embed = new EmbedBuilder()
            .setColor('#FF0000')
            .setAuthor({ 
                name: `${username}'s Test Results 🏆`, 
                iconURL: tester.displayAvatarURL() 
            })
            .setThumbnail(thumbnailUrl)
            .setDescription(
                `**Tester:**\n<@${tester.id}>\n\n` +
                `**Region:**\n${region}\n\n` +
                `**Username:**\n${username}\n\n` +
                `**Previous Rank:**\n${previousRank}\n\n` +
                `**Rank Earned:**\n${rankEarned}`
            );

        const responseMessage = await interaction.reply({
            content: `<@${tester.id}>`,
            embeds: [embed],
            fetchReply: true
        });

        const emojis = ['👑', '🥳', '😱', '😭', '😂', '💀'];
        for (const emoji of emojis) {
            await responseMessage.react(emoji);
        }
    }
});

client.login(TOKEN);
