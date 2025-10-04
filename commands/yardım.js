import { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from 'discord.js';

const EMOJIS = {
    home: '🏠', giveaway: '🎉', ticket: '🎫',
    level: '📊', moderasyon: '🛡️', command: '💻', arrow: '➡️'
};
const SERVER_LOGO = 'https://i.imgur.com/XXXXXXX.png';

function getHelpEmbed(user){
    return new EmbedBuilder()
        .setTitle(`${EMOJIS.home} NexTro Bot Yardım`)
        .setDescription(`***Merhaba, ${user}!***\n> Prefix: n!\n${EMOJIS.arrow} Komut Kategorileri: Çekiliş, Ticket, Level, Moderasyon`)
        .setColor(0x5865F2)
        .setFooter({ text: 'NexTro | Yardım Menüsü', iconURL: SERVER_LOGO });
}

function getCategoryEmbed(category){
    switch(category){
        case 'Çekiliş': return new EmbedBuilder().setDescription(`${EMOJIS.giveaway} Çekiliş Komutları`).setColor(0x00FF00);
        case 'Ticket': return new EmbedBuilder().setDescription(`${EMOJIS.ticket} Ticket Komutları`).setColor(0xFFA500);
        case 'Level': return new EmbedBuilder().setDescription(`${EMOJIS.level} Level Komutları`).setColor(0x00FFFF);
        case 'Moderasyon': return new EmbedBuilder().setDescription(`${EMOJIS.moderasyon} Moderasyon Komutları`).setColor(0xFF0000);
        default: return getHelpEmbed('Kullanıcı');
    }
}

export default {
    data: { name: 'yardım', description: 'Yardım menüsünü gösterir' },

    async execute(message){
        const embed = getHelpEmbed(message.author);
        const select = new StringSelectMenuBuilder()
            .setCustomId('kategori_sec')
            .setPlaceholder('Bir kategori seçin...')
            .addOptions([
                { label: 'Çekiliş', value: 'Çekiliş', emoji: EMOJIS.giveaway },
                { label: 'Ticket', value: 'Ticket', emoji: EMOJIS.ticket },
                { label: 'Level', value: 'Level', emoji: EMOJIS.level },
                { label: 'Moderasyon', value: 'Moderasyon', emoji: EMOJIS.moderasyon }
            ]);

        const row = new ActionRowBuilder().addComponents(select);
        const sent = await message.channel.send({ embeds: [embed], components: [row] });

        const collector = sent.createMessageComponentCollector({ time: 120000 });
        collector.on('collect', async i => {
            if(i.isStringSelectMenu()) await i.update({ embeds: [getCategoryEmbed(i.values[0])], components: [row] });
        });
    },

    async executeSlash(interaction){
        const embed = getHelpEmbed(interaction.user);
        const select = new StringSelectMenuBuilder()
            .setCustomId('kategori_sec')
            .setPlaceholder('Bir kategori seçin...')
            .addOptions([
                { label: 'Çekiliş', value: 'Çekiliş', emoji: EMOJIS.giveaway },
                { label: 'Ticket', value: 'Ticket', emoji: EMOJIS.ticket },
                { label: 'Level', value: 'Level', emoji: EMOJIS.level },
                { label: 'Moderasyon', value: 'Moderasyon', emoji: EMOJIS.moderasyon }
            ]);
        const row = new ActionRowBuilder().addComponents(select);
        await interaction.reply({ embeds: [embed], components: [row] });

        const collector = interaction.channel.createMessageComponentCollector({ time: 120000 });
        collector.on('collect', async i => {
            if(i.isStringSelectMenu()) await i.update({ embeds: [getCategoryEmbed(i.values[0])], components: [row] });
        });
    }
};
