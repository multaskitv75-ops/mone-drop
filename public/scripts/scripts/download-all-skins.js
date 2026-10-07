const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

console.log(' Автоматическая загрузка картинок скинов...\n');

const downloadDir = path.join(__dirname, '..', 'public', 'images', 'skins');

// Создаем папку если нет
if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

// Список всех твоих скинов (из data.js)
const mySkins = [
    { id: 1, name: "P250 | Sand Dune" },
    { id: 2, name: "MAG-7 | Storm" },
    { id: 3, name: "MP9 | Storm" },
    { id: 4, name: "Nova | Polar Mesh" },
    { id: 5, name: "G3SG1 | Safari Mesh" },
    { id: 6, name: "SCAR-20 | Sand Mesh" },
    { id: 7, name: "PP-Bizon | Sand Dashed" },
    { id: 8, name: "UMP-45 | Mudder" },
    { id: 9, name: "FAMAS | Colony" },
    { id: 10, name: "Galil AR | Sage Spray" },
    { id: 11, name: "P90 | Sand Spray" },
    { id: 12, name: "SSG 08 | Sand Dune" },
    { id: 13, name: "MAC-10 | Sand Dashed" },
    { id: 14, name: "XM1014 | Sand Dune" },
    { id: 15, name: "MP7 | Army Recon" },
    { id: 16, name: "M249 | Contrast Spray" },
    { id: 17, name: "Glock-18 | Groundwater" },
    { id: 18, name: "USP-S | Forest DDPAT" },
    { id: 19, name: "AK-47 | Safari Mesh" },
    { id: 20, name: "M4A4 | Desert Storm" },
    { id: 21, name: "AWP | Safari Mesh" },
    { id: 22, name: "Desert Eagle | Urban DDPAT" },
    { id: 23, name: "P250 | Boreal Forest" },
    { id: 24, name: "Five-SeveN | Forest Night" },
    { id: 25, name: "Tec-9 | Sand Dune" },
    { id: 26, name: "MP5-SD | Autumn Twilly" },
    { id: 27, name: "SG 553 | Army Sheen" },
    { id: 28, name: "AUG | Sand Dune" },
    { id: 29, name: "SCAR-20 | Cardiac" },
    { id: 30, name: "G3SG1 | Desert Storm" },
    { id: 31, name: "Nova | Graphite" },
    { id: 32, name: "XM1014 | Tranquility" },
    { id: 33, name: "AK-47 | Blue Laminate" },
    { id: 34, name: "M4A1-S | Boreal Forest" },
    { id: 35, name: "AWP | Worm God" },
    { id: 36, name: "P90 | Elite Build" },
    { id: 37, name: "MP7 | Skulls" },
    { id: 38, name: "UMP-45 | Carbon Fiber" },
    { id: 39, name: "FAMAS | Cyanospatter" },
    { id: 40, name: "Galil AR | Tuxedo" },
    { id: 41, name: "AK-47 | Redline" },
    { id: 42, name: "M4A4 | Red DDPAT" },
    { id: 43, name: "AWP | Redline" },
    { id: 44, name: "Desert Eagle | Conspiracy" },
    { id: 45, name: "USP-S | Orion" },
    { id: 46, name: "Glock-18 | Reactor" },
    { id: 47, name: "P250 | Nuclear Threat" },
    { id: 48, name: "Five-SeveN | Case Hardened" },
    { id: 49, name: "AK-47 | Vulcan" },
    { id: 50, name: "M4A4 | Asiimov" },
    { id: 51, name: "AWP | Asiimov" },
    { id: 52, name: "USP-S | Kill Confirmed" },
    { id: 53, name: "Glock-18 | Water Elemental" },
    { id: 54, name: "Desert Eagle | Code Red" },
    { id: 55, name: "P250 | Asiimov" },
    { id: 56, name: "Five-SeveN | Hyper Beast" },
    { id: 57, name: "AK-47 | Fire Serpent" },
    { id: 58, name: "M4A4 | Howl" },
    { id: 59, name: "AWP | Dragon Lore" },
    { id: 60, name: "AWP | Hyper Beast" },
    { id: 61, name: "M4A1-S | Printstream" },
    { id: 62, name: "Desert Eagle | Blaze" },
    { id: 63, name: "★ Gut Knife | Fade" },
    { id: 64, name: "★ Huntsman Knife | Fade" },
    { id: 65, name: "★ Flip Knife | Fade" },
    { id: 66, name: "★ Bayonet | Fade" },
    { id: 67, name: "★ Karambit | Fade" },
    { id: 68, name: "★ Butterfly Knife | Fade" }
];

// Функция скачивания файла
function downloadFile(url, filePath) {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;
        
        client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
            if (response.statusCode === 200) {
                const stream = fs.createWriteStream(filePath);
                response.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        }).on('error', () => resolve(false));
    });
}

// Функция поиска картинки на CSGOStash
async function findSkinImage(skinName) {
    // Используем Steam CDN напрямую
    const steamId = getSteamIdFromName(skinName); // Нужно маппить названия
    return `https://steamcommunity-a.akamaihd.net/economy/image/${steamId}/360fx360f`;
}

// Основная функция
async function downloadAllSkins() {
    let success = 0;
    let failed = 0;
    
    console.log(`📦 Начинаю загрузку ${mySkins.length} скинов...\n`);
    
    for (const skin of mySkins) {
        const fileName = `skin-${skin.id}.webp`;
        const filePath = path.join(downloadDir, fileName);
        
        // Пропускаем если файл уже есть
        if (fs.existsSync(filePath)) {
            console.log(`⏭️  Пропущен: ${skin.name} (уже существует)`);
            success++;
            continue;
        }
        
        console.log(`️  Загружаю: ${skin.name}...`);
        
        // Ищем картинку
        const imageUrl = await findSkinImage(skin.name);
        
        if (imageUrl) {
            const downloaded = await downloadFile(imageUrl, filePath);
            if (downloaded) {
                console.log(`✅ Успешно: ${skin.name}`);
                success++;
            } else {
                console.log(`❌ Не удалось скачать: ${skin.name}`);
                failed++;
            }
        } else {
            console.log(`❌ Картинка не найдена: ${skin.name}`);
            failed++;
        }
        
        // Задержка чтобы не блокировали
        await new Promise(r => setTimeout(r, 1000));
    }
    
    console.log(`\n🎉 Готово!`);
    console.log(`✅ Успешно: ${success}`);
    console.log(`❌ Ошибки: ${failed}`);
    console.log(`📁 Папка: ${downloadDir}`);
}

downloadAllSkins();