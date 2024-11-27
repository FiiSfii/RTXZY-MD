const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Penggunaan:\n${usedPrefix + command} <link/query>\n\nContoh:\n${usedPrefix + command} https://youtube.com/watch?v=dQw4w9WgXcQ`;
    }
    try {
        m.reply('⏳ Sedang memproses, mohon tunggu...');

        let response = await ytdl(text);

        let videoUrl = response.data?.mp3;
        if (!videoUrl) {
            throw 'Maaf, video tidak dapat ditemukan atau diunduh.';
        }

        await conn.sendMessage(m.chat, { audio: { url: videoUrl }, mimetype: "audio/mp4", ptt: false }, { quoted: m });

    } catch (error) {
        console.error(error);
        m.reply(`❌ Terjadi kesalahan: ${error.message || error}`);
    }
};

handler.help = ["ytmp3 <link/query>"];
handler.tags = ["downloader"];
handler.command = /^ytmp3$/i;

module.exports = handler;

async function ytdl(url) {
    const response = await fetch('https://shinoa.us.kg/api/download/ytdl', {
        method: 'POST',
        headers: {
            'accept': '*/*',
            'api_key': 'free',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            text: url
        })
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
      }
