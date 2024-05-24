const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const token = '7023507269:AAFYOZ4z3wYIxXZBe-DgxCiVkNkb66Xw0Sc';
const dy = new TelegramBot(token, { polling: true });
const os = require('os');

dy.onText(/\/getgroupid/, (msg) => {
    const chatId = msg.chat.id;
    dy.sendMessage(chatId, `ID grup ini adalah: ${chatId}`);
});

dy.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const now = new Date();
  const dateString = now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const name = msg.from.first_name;
  const imageUrl = 'https://telegra.ph/file/662564e95a8fe4c21cb33.jpg'
  dy.sendPhoto(chatId, imageUrl, {
    caption: `Halo ${name}👋🏻\nWaktu sekarang: ${dateString}\n\n *BERIKUT MENU BOT DYCODERS* \n\n` +
      "/start - untuk memulai dy\n" +
      "/tiktok - untuk download vt\n" +
      "/ig - untuk download vidio ig\n" +
      "/sps - search lagu Spotify\n" +
      "/spdl - untuk dowmlaod lagu Spotify\n" +
      "/ai - pastikan menggunakan text\n" +
      "/pixiv - untuk mencari anime\n" +
      "/aisiska - ai yang bernama siska\n" +
      "/ttsearch - mencari vt tiktok\n" +
      "/ping - melihat peforma dy\n" +
      "/tracknik - nik ktp\n" +
      "/cekip - detail ip\n" +
      "/ps - pintrest search\n" +
      "/snds - sound cloud search\n" +
      "/sndl - sound cloud download\n" +
      "/gsearch - google search\n" +
      "/createqr - text to qr\n" +
      "/ssweb - url web\n" +
      
      "\n\n *CONTACT OWNER DI BAWAH INI* ",
    reply_markup: {
      inline_keyboard: [
        [
          { text: 'CONTACT', url: 'https://t.me/dycoders' }
        ],
                [
          { text: 'LAPOR BUG', url: 'https://ngl.link/dycoders' }
        ],
        [
          { text: 'GRUP DYCODERS', url: 'https://t.me/dydycoders' }
        ]
      ]
    },
    parse_mode: "Markdown",
    mask_position: {
      point: "center",
      x_shift: 0.5,
      y_shift: 0.5,
      scale: 1
    }
  });
});




dy.onText(/\/cekip (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const ip = match[1];

    try {
        let response;
        if (ip) {
            response = await axios.get(`https://dikaardnt.com/api/ip/${ip}`);
        } else {
            response = await axios.get(`https://dikaardnt.com/api/ip/`);
        }

        const ipData = response.data;

        
        let message = `Informasi IP:\n`;
        message += `IP Address: ${ipData.query}\n`;
        message += `Negara: ${ipData.country}\n`;
        message += `Kode Negara: ${ipData.countryCode}\n`;
        message += `Provinsi: ${ipData.region}\n`;
        message += `Nama Provinsi: ${ipData.regionName}\n`;
        message += `Kota: ${ipData.city}\n`;
        message += `Kode Pos: ${ipData.zip}\n`;
        message += `Waktu: ${ipData.datetime}\n`;
        message += `Latitude: ${ipData.lat}\n`;
        message += `Longitude: ${ipData.lon}\n`;
        message += `Zona Waktu: ${ipData.timezone}\n`;
        message += `Penyedia Layanan Internet (ISP): ${ipData.isp}\n`;
        message += `AS: ${ipData.as}\n`;

        dy.sendMessage(chatId, message);
    } catch (error) {
        console.error('Error fetching IP information:', error);
        dy.sendMessage(chatId, 'Ups, terjadi kesalahan saat mengambil informasi IP.');
    }
});


dy.onText(/\/tiktok (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tiktokUrl = match[1];

  try {
    
    const response = await axios.get(`https://dikaardnt.com/api/download/tiktok?url=${tiktokUrl}`);
    const tiktokInfo = response.data;

    
    const videoUrl = tiktokInfo.video.url.without_watermark;
    const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });

    
    await dy.sendVideo(chatId, videoBuffer.data, { caption: tiktokInfo.desc });
  } catch (error) {
    console.error('Error fetching TikTok video:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh video TikTok.');
  }
});

dy.onText(/\/ig (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const instagramUrl = match[1];

  try {
    
    const response = await axios.get(`https://dikaardnt.com/api/download/instagram?url=${instagramUrl}`);
    const igInfo = response.data;

    await dy.sendVideo(chatId, igInfo[0]);
  } catch (error) {
    console.error('Error fetching Instagram video:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mengunduh video Instagram.');
  }
});


function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

dy.onText(/\/ssweb(.+)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const input = match[1] ? match[1].trim() : '';

    if (input.length === 0) {
        dy.sendMessage(chatId, "Please provide a URL to capture.");
        return;
    }

    const url = input.startsWith('http') ? input : 'http://' + input;

    try {
        const apiKey = "9a202a61afaa4ba0877f12f03e86ea96";
        const response = await axios.get(`https://api.apiflash.com/v1/urltoimage?access_key=${apiKey}&url=${encodeURIComponent(url)}&full_page=true&response_type=json&no_cookie_banners=true&no_ads=true&no_tracking=true`);

        const imageData = response.data;
        const imageUrl = imageData.url;

        dy.sendPhoto(chatId, imageUrl);
    } catch (error) {
        console.error('Error capturing webpage:', error);
        dy.sendMessage(chatId, 'Error capturing webpage. Please try again later.');
    }
});

dy.onText(/\/gsearch (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    if (!query) {
        dy.sendMessage(chatId, "masukan text contoh /gsearch apa itu coding");
        return;
    }

    try {
        const response = await axios.get(`https://dikaardnt.com/api/search/google?q=${encodeURIComponent(query)}`);
        const searchData = response.data;

        
        let message = `Search results for "${query}":\n\n`;
        const results = searchData.result.slice(0, 8); 
        results.forEach((result, index) => {
            message += `${index + 1}. [${result.title}](${result.url})\n${result.originalUrl}\n\n`;
        });

        dy.sendMessage(chatId, message, { parse_mode: "Markdown" });
    } catch (error) {
        console.error('Error fetching search results:', error);
        dy.sendMessage(chatId, 'Error fetching search results. Please try again later.');
    }
});



dy.onText(/\/ai (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const message = match[1];

  try {
    
    const response = await axios.get(`https://dikaardnt.com/api/tool/openai?message=${encodeURIComponent(message)}`);
    const aiResponse = response.data;

    
    await dy.sendMessage(chatId, aiResponse);
  } catch (error) {
    console.error('Error fetching AI response:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat meminta respons dari AI.');
  }
});
dy.onText(/\/ttsearch (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const keywords = match[1];

  try {
   
    const response = await axios.get(`https://skizo.tech/api/tiktok-search?apikey=xyydycoders&keywords=${keywords}`);
    const searchResults = response.data;

    
    if (searchResults.length > 0) {
      
      const firstResult = searchResults[0];
      
     
      await dy.sendVideo(chatId, firstResult.play, { caption: firstResult.title });
    } else {
      await dy.sendMessage(chatId, 'Maaf, tidak ditemukan hasil pencarian untuk kata kunci yang diberikan.');
    }
  } catch (error) {
    console.error('Error fetching TikTok search results:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat melakukan pencarian video TikTok.');
  }
});
dy.onText(/\/simi (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const text = match[1];

  try {
    
    const response = await axios.get(`https://skizo.tech/api/simi?apikey=xyydycoders&text=${encodeURIComponent(text)}`);
    const simiResponse = response.data;

    
    await dy.sendMessage(chatId, simiResponse.result);
  } catch (error) {
    console.error('Error fetching simi response:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat meminta respons dari Simi.');
  }
});
dy.onText(/\/pixiv (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const searchQuery = match[1];

  try {
    
    const response = await axios.get(`https://skizo.tech/api/pixiv/search?apikey=xyydycoders&search=${encodeURIComponent(searchQuery)}`);
    const pixivResults = response.data;

    
    const randomIndex = Math.floor(Math.random() * pixivResults.length);
    const pixivResult = pixivResults[randomIndex];

   
    await dy.sendPhoto(chatId, pixivResult.url, { caption: pixivResult.title });
  } catch (error) {
    console.error('Error fetching Pixiv search results:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat melakukan pencarian di Pixiv.');
  }
});
dy.onText(/\/antidy (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const searchQuery = match[1];

  try {
    
    const response = await axios.get(`https://skizo.tech/api/xnxxsearch?apikey=xyydycoders&search=${encodeURIComponent(searchQuery)}`);
    const antidyResults = response.data;

  
    const topResults = antidyResults.slice(0, 3);

  
    for (const result of topResults) {
      await dy.sendMessage(chatId, result.link);
    }
  } catch (error) {
    console.error('Error fetching Antidy search results:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat melakukan pencarian di Antidy.');
  }
});
dy.onText(/\/download (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const searchQuery = match[1];

  try {
    
    const response = await axios.get(`https://skizo.tech/api/download?apikey=xyydycoders&url=${encodeURIComponent(searchQuery)}`);
    const downloadResult = response.data.response;

    
    const highQualityFormat = downloadResult.formats.find(format => format.q === 'High MP4');
    const videoUrl = highQualityFormat ? highQualityFormat.url : null;

    
    if (videoUrl) {
      
      const videoResponse = await axios.get(videoUrl, { responseType: 'stream' });
      const videoFileStream = fs.createWriteStream('video.mp4');
      videoResponse.data.pipe(videoFileStream);

      
      videoFileStream.on('finish', () => {
        
        dy.sendVideo(chatId, 'video.mp4');
      });
    } else {
      await dy.sendMessage(chatId, 'Maaf, tidak ada video yang tersedia.');
    }
  } catch (error) {
    console.error('Error fetching download link:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat mencoba mengunduh video.');
  }
});
dy.onText(/\/ytsearch (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const query = match[1];

  try {
    const response = await axios.get(`https://api.miftahganzz.my.id/api/search/youtube?title=${encodeURIComponent(query)}&apikey=miftah`);
    const searchResults = response.data.data;

    if (searchResults.length > 0) {
      const firstResult = searchResults[0];
      await dy.sendMessage(chatId, `Title: ${firstResult.title}\nURL: ${firstResult.url}`);
    } else {
      await dy.sendMessage(chatId, 'Maaf, tidak ditemukan hasil pencarian untuk kata kunci yang diberikan.');
    }
  } catch (error) {
    console.error('Error fetching YouTube search results:', error);
    await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat melakukan pencarian video YouTube.');
  }
});
const yts = require('yt-search');
const ytdl = require('ytdl-core');


dy.onText(/\/aisiska (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    try {
        const response = await axios.get(`https://api.miftahganzz.my.id/api/ai/siska?q=${encodeURIComponent(query)}&user=dycoders&apikey=miftah`);
        const aisiskaResponse = response.data.respon;

        await dy.sendMessage(chatId, aisiskaResponse);
    } catch (error) {
        console.error('Error fetching Aisiska response:', error);
        await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat meminta respons dari Aisiska.');
    }
});
dy.onText(/\/tracknik (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const nik = match[1];

    try {
        const response = await axios.get(`https://skizo.tech/api/checknik?apikey=xyydycoders&nik=${nik}`);
        const tracknikInfo = response.data.message.data;

        let tracknikMessage = `
NIK: ${tracknikInfo.nik}
Jenis Kelamin: ${tracknikInfo.jk}
Tanggal Lahir: ${tracknikInfo.tgl}
Kecamatan: ${tracknikInfo.kec}
Kabupaten/Kota: ${tracknikInfo.kab}
Provinsi: ${tracknikInfo.prov}
Sumber: ${tracknikInfo.source}
Terakhir Dimodifikasi: ${tracknikInfo.modified_time}
`;

        await dy.sendMessage(chatId, tracknikMessage);
    } catch (error) {
        console.error('Error fetching Track NIK info:', error);
        await dy.sendMessage(chatId, 'Maaf, terjadi kesalahan saat melakukan pengecekan NIK.');
    }
});

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

dy.onText(/\/ping|\/dystatus|\/statusdy/, async (msg) => {
    const chatId = msg.chat.id;

    const used = process.memoryUsage();
    const cpus = os.cpus().map(cpu => {
        cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
        return cpu;
    });
    const cpu = cpus.reduce((last, cpu, _, { length }) => {
        last.total += cpu.total;
        last.speed += cpu.speed / length;
        last.times.user += cpu.times.user;
        last.times.nice += cpu.times.nice;
        last.times.sys += cpu.times.sys;
        last.times.idle += cpu.times.idle;
        last.times.irq += cpu.times.irq;
        return last;
    }, {
        speed: 0,
        total: 0,
        times: {
            user: 0,
            nice: 0,
            sys: 0,
            idle: 0,
            irq: 0
        }
    });
    let timestamp = Date.now();
    let latency = Date.now() - timestamp;
    let runtime = process.uptime();
    let respon = `
    Kecepatan Respon: ${latency.toFixed(4)} detik
    Waktu Aktif: ${runtime.toFixed(2)} detik

    💻 Info Server
    RAM: ${formatBytes(os.totalmem() - os.freemem())} / ${formatBytes(os.totalmem())}

    _NodeJS Memory Usage_
    ${Object.keys(used).map((key, _, arr) => `${key.padEnd(Math.max(...arr.map(v => v.length)), ' ')}: ${formatBytes(used[key])}`).join('\n')}

    ${cpus[0] ? `
    _Total CPU Usage_
    ${cpus[0].model.trim()} (${cpu.speed} MHz)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}
    _CPU Core(s) Usage (${cpus.length} Core CPU)_
    ${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()} (${cpu.speed} MHz)\n${Object.keys(cpu.times).map(type => `- *${(type + '*').padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}
    ` : ''}
    `.trim();

    await dy.sendMessage(chatId, respon, { parse_mode: 'Markdown' });
});
const { Telegraf } = require('telegraf');

dy.onText(/\/bingai (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1]; 

    try {

        await dy.sendMessage(chatId, 'Please wait...');

        const response = await axios.get(`https://api.miftahganzz.my.id/api/ai/bing-ai?model=Creative&stream=true&q=${encodeURIComponent(query)}&apikey=miftah`);
        const bingAIResponse = response.data;

        if (bingAIResponse.status === 'success') {
            const result = bingAIResponse.data.result;
            await dy.sendMessage(chatId, result);
        } else {
            await dy.sendMessage(chatId, 'Failed to get response from Bing AI.');
        }
    } catch (error) {
        console.error('Error getting response from Bing AI:', error);
        await dy.sendMessage(chatId, 'An error occurred while getting response from Bing AI.');
    }
});
dy.onText(/\/spdl (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const spotifyUrl = match[1]; 

    try {
        
        await dy.sendMessage(chatId, 'Please wait...');

        const response = await axios.get(`https://api.betabotz.eu.org/api/download/spotify?url=${encodeURIComponent(spotifyUrl)}&apikey=H4SMWEra`);
        const downloadInfo = response.data.result.data;

        
        if (downloadInfo.url) {
            
            const songUrl = downloadInfo.url;
            const songResponse = await axios.get(songUrl, { responseType: 'arraybuffer' });

            
            const fileName = `${downloadInfo.title}.mp3`;
            fs.writeFileSync(fileName, Buffer.from(songResponse.data));

          
            await dy.sendAudio(chatId, fileName, { title: downloadInfo.title });

            
            fs.unlinkSync(fileName);
        } else {
            
            await dy.sendMessage(chatId, 'Failed to fetch download link for the given Spotify URL.');
        }
    } catch (error) {
        
        console.error('Error downloading song from Spotify:', error);
        await dy.sendMessage(chatId, 'An error occurred while downloading the song from Spotify.');
    }
});
dy.onText(/\/sps (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1]; 

    try {
        await dy.sendMessage(chatId, 'Searching on Spotify...');

        const response = await axios.get(`https://dikaardnt.com/api/search/spotify?q=${encodeURIComponent(query)}`);
        const searchResults = response.data.slice(0, 2); 

        if (searchResults.length > 0) {
            const message = searchResults.map((result, index) => {
                return `${index + 1}. *${result.album.name}* by *${result.artists[0].name}*\n${result.url}`;
            }).join('\n\n');
            
            await dy.sendMessage(chatId, message, { parse_mode: 'Markdown' });
        } else {
            await dy.sendMessage(chatId, 'No results found on Spotify.');
        }
    } catch (error) {
        console.error('Error searching on Spotify:', error);
        await dy.sendMessage(chatId, 'An error occurred while searching on Spotify.');
    }
});
const qrcode = require('qrcode');

dy.onText(/\/createqr (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];

    try {
      
        const qrDataUrl = await qrcode.toDataURL(text, { scale: 35 });

      
        const base64String = qrDataUrl.split(',')[1];

      
        const imageData = Buffer.from(base64String, 'base64');

       
        await dy.sendPhoto(chatId, imageData, { caption: 'QR code berhasil dibuat!' });
    } catch (error) {
        console.error('Error creating QR code:', error);
        dy.sendMessage(chatId, 'Ups, terjadi kesalahan saat membuat QR code.');
    }
});
dy.on('new_chat_members', async (msg) => {
    const chatId = msg.chat.id;
    const newMembers = msg.new_chat_members;

    newMembers.forEach(async (member) => {
        const firstName = member.first_name;
        const lastName = member.last_name ? member.last_name : '';
        const fullName = lastName ? `${firstName} ${lastName}` : firstName;

        const welcomeMessage = `Welcome to the group, ${fullName}!`;

        try {
            await dy.sendMessage(chatId, welcomeMessage);
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }
    });
});

const pinterestApiKey = 'xyydycoders';


const pinterestApiUrl = 'https://skizo.tech/api/pinterest';



async function getPinterestImage(query) {
    try {

        const response = await axios.get(pinterestApiUrl, {
            params: {
                apikey: pinterestApiKey,
                search: query
            }
        });
        

        const imageData = response.data.data[Math.floor(Math.random() * response.data.data.length)];
        
        return imageData.media.url;
    } catch (error) {
        console.error('Error getting Pinterest image:', error);
        throw new Error('Error getting Pinterest image');
    }
}


dy.onText(/\/ps (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    try {
        const imageUrl = await getPinterestImage(query);

        
        dy.sendPhoto(chatId, imageUrl);
    } catch (error) {
        console.error('Error sending Pinterest image:', error);
        dy.sendMessage(chatId, 'Terjadi kesalahan saat mencoba mendapatkan gambar dari Pinterest.');
    }
});


async function searchSoundCloud(query) {
    try {
        const apiUrl = `https://api.maher-zubair.tech/search/soundcloud?q=${query}`;
        const response = await axios.get(apiUrl);
        const data = response.data.result.result.slice(0, 2);
        return data.map(item => ({
            title: item.title,
            url: item.url,
            thumb: item.thumb,
            artist: item.artist,
            views: item.views,
            release: item.release,
            timestamp: item.timestamp
        }));
    } catch (error) {
        console.error('Error fetching SoundCloud search results:', error);
        return [];
    }
}


dy.onText(/\/snds (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];

    try {
        const results = await searchSoundCloud(query);
        if (results.length === 0) {
            dy.sendMessage(chatId, 'No SoundCloud search results found for the given query.');
        } else {
            let message = '';
            results.forEach(result => {
                message += `
Title: ${result.title}
Artist: ${result.artist}
Views: ${result.views}
Release: ${result.release}
Timestamp: ${result.timestamp}
URL: ${result.url}\n\n`;
            });
            dy.sendMessage(chatId, message);
        }
    } catch (error) {
        console.error('Error handling SoundCloud search command:', error);
        dy.sendMessage(chatId, 'An error occurred while processing the command. Please try again later.');
    }
});





const soundcloudApiUrl = 'https://api.maher-zubair.tech/download/soundcloud';




async function downloadSoundcloudTrack(url) {
    try {

        const response = await axios.get(`${soundcloudApiUrl}?url=${encodeURIComponent(url)}`);
        const trackData = response.data.result;


        const fileResponse = await axios.get(trackData.link, { responseType: 'arraybuffer' });


        return {
            title: trackData.title,
            audio: fileResponse.data
        };
    } catch (error) {
        console.error('Error downloading SoundCloud track:', error);
        throw new Error('Error downloading SoundCloud track');
    }
}


dy.onText(/\/sndl (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const url = match[1];

    try {

        const trackData = await downloadSoundcloudTrack(url);


        dy.sendAudio(chatId, trackData.audio, { title: trackData.title });
    } catch (error) {
        console.error('Error sending SoundCloud track:', error);
        dy.sendMessage(chatId, 'Terjadi kesalahan saat mencoba mengunduh lagu dari SoundCloud.');
    }
});


async function getAIImageURL(query) {
    try {
        if (!query.trim()) {
            throw new Error('Query cannot be empty');
        }
        const apiUrl = `https://api.maher-zubair.tech/ai/photoleap?q=${query}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.result) {
            return data.result;
        } else {
            throw new Error('No result found for the query');
        }
    } catch (error) {
        console.error('Error fetching AI Image URL:', error.message);
        return null;
    }
}


dy.onText(/\/aimg (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const query = match[1];


    if (!query.trim()) {
        dy.sendMessage(chatId, 'Query tidak boleh kosong.');
        return;
    }


    const imageURL = await getAIImageURL(query);
    if (imageURL) {

        dy.sendPhoto(chatId, imageURL);
    } else {
        dy.sendMessage(chatId, 'Gagal mendapatkan gambar AI untuk query: ' + query);
    }
});


async function getTTSMP3URL(text, voice) {
    try {
        if (!text.trim()) {
            throw new Error('Text cannot be empty');
        }
        const apiUrl = `https://skizo.tech/api/tts?apikey=xyydycoders&text=${encodeURIComponent(text)}&voice=${voice}`;
        const response = await axios.get(apiUrl);
        const data = response.data;
        if (data.status === 200 && data.url) {
            return data.url;
        } else {
            throw new Error('Failed to fetch TTS MP3 URL');
        }
    } catch (error) {
        console.error('Error fetching TTS MP3 URL:', error.message);
        return null;
    }
}

dy.onText(/\/aitts (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    const voice = 'erica'; 


    if (!text.trim()) {
        dy.sendMessage(chatId, 'Text tidak boleh kosong.');
        return;
    }


    const mp3URL = await getTTSMP3URL(text, voice);
    if (mp3URL) {

        dy.sendAudio(chatId, mp3URL);
    } else {
        dy.sendMessage(chatId, 'Gagal mendapatkan file audio TTS untuk teks: ' + text);
    }
});
dy.onText(/\/play (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const keyword = match[1];
  try {
  dy.sendMessage(chatId, 'Please wait...');
  

    const searchResponse = await axios.get(`https://api.maher-zubair.tech/search/soundcloud?q=${keyword}`);
    const songUrl = searchResponse.data.result.result[0].url; 

    
    const downloadResponse = await axios.get(`https://api.maher-zubair.tech/download/soundcloud?url=${encodeURIComponent(songUrl)}`);
    const downloadUrl = downloadResponse.data.result.link;

   
    dy.sendAudio(chatId, downloadUrl);
  } catch (error) {
    console.error(error);
    dy.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam memproses permintaan Anda.');
  }
});
dy.onText(/\/solve (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const equation = match[1];

  try {
 
    dy.sendMessage(chatId, 'Please wait...');


    const mathResponse = await axios.get(`https://api.maher-zubair.tech/ai/mathssolve?q=${encodeURIComponent(equation)}`);
    const solution = mathResponse.data.result;

   
  dy.sendMessage(chatId, solution);
  } catch (error) {
    console.error(error);
    dy.sendMessage(chatId, 'Maaf, terjadi kesalahan dalam memproses permintaan Anda.');
  }
});

console.log("BOT BERHASIL DI RUN SC BY: DYCODERS");