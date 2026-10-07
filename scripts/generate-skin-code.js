const fs = require('fs');
const path = require('path');

const skinsDir = path.join(__dirname, '..', 'public', 'images', 'skins');

// 1. Читаем все файлы из папки
const files = fs.readdirSync(skinsDir)
    .filter(f => f.startsWith('skin-')) // Берем только наши скачанные файлы
    .sort((a, b) => {
        // Сортируем правильно: skin-2 должен идти после skin-1, а не после skin-10
        const numA = parseInt(a.match(/\d+/)[0]);
        const numB = parseInt(b.match(/\d+/)[0]);
        return numA - numB;
    });

console.log(`📁 Найдено ${files.length} картинок.\n`);

// 2. Твой текущий список скинов (я взял его из твоего прошлого сообщения)
// Скрипт автоматически добавит к ним поле image
const mySkins = [
    { id: 1, name: "P250 | Sand Dune", price: 12, rarity: "consumer", icon: "🔫" },
    { id: 2, name: "MAG-7 | Storm", price: 18, rarity: "consumer", icon: "🔫" },
    { id: 3, name: "MP9 | Storm", price: 22, rarity: "consumer", icon: "🔫" },
    { id: 4, name: "Nova | Polar Mesh", price: 28, rarity: "consumer", icon: "🔫" },
    { id: 5, name: "G3SG1 | Safari Mesh", price: 32, rarity: "consumer", icon: "🔫" },
    { id: 6, name: "SCAR-20 | Sand Mesh", price: 38, rarity: "consumer", icon: "🔫" },
    { id: 7, name: "PP-Bizon | Sand Dashed", price: 42, rarity: "consumer", icon: "🔫" },
    { id: 8, name: "UMP-45 | Mudder", price: 48, rarity: "consumer", icon: "🔫" },
    { id: 9, name: "FAMAS | Colony", price: 55, rarity: "consumer", icon: "🔫" },
    { id: 10, name: "Galil AR | Sage Spray", price: 65, rarity: "consumer", icon: "🔫" },
    { id: 11, name: "P90 | Sand Spray", price: 75, rarity: "consumer", icon: "🔫" },
    { id: 12, name: "SSG 08 | Sand Dune", price: 85, rarity: "consumer", icon: "🔫" },
    { id: 13, name: "MAC-10 | Sand Dashed", price: 95, rarity: "consumer", icon: "🔫" },
    { id: 14, name: "XM1014 | Sand Dune", price: 110, rarity: "consumer", icon: "🔫" },
    { id: 15, name: "MP7 | Army Recon", price: 125, rarity: "consumer", icon: "🔫" },
    { id: 16, name: "M249 | Contrast Spray", price: 140, rarity: "consumer", icon: "🔫" },
    { id: 17, name: "Glock-18 | Groundwater", price: 160, rarity: "industrial", icon: "🔫" },
    { id: 18, name: "USP-S | Forest DDPAT", price: 180, rarity: "industrial", icon: "🔫" },
    { id: 19, name: "AK-47 | Safari Mesh", price: 200, rarity: "industrial", icon: "🔫" },
    { id: 20, name: "M4A4 | Desert Storm", price: 230, rarity: "industrial", icon: "🔫" },
    { id: 21, name: "AWP | Safari Mesh", price: 260, rarity: "industrial", icon: "🔫" },
    { id: 22, name: "Desert Eagle | Urban DDPAT", price: 290, rarity: "industrial", icon: "🔫" },
    { id: 23, name: "P250 | Boreal Forest", price: 320, rarity: "industrial", icon: "🔫" },
    { id: 24, name: "Five-SeveN | Forest Night", price: 360, rarity: "industrial", icon: "🔫" },
    { id: 25, name: "Tec-9 | Sand Dune", price: 420, rarity: "milspec", icon: "🔫" },
    { id: 26, name: "MP5-SD | Autumn Twilly", price: 480, rarity: "milspec", icon: "🔫" },
    { id: 27, name: "SG 553 | Army Sheen", price: 540, rarity: "milspec", icon: "🔫" },
    { id: 28, name: "AUG | Sand Dune", price: 600, rarity: "milspec", icon: "🔫" },
    { id: 29, name: "SCAR-20 | Cardiac", price: 680, rarity: "milspec", icon: "🔫" },
    { id: 30, name: "G3SG1 | Desert Storm", price: 750, rarity: "milspec", icon: "🔫" },
    { id: 31, name: "Nova | Graphite", price: 820, rarity: "milspec", icon: "🔫" },
    { id: 32, name: "XM1014 | Tranquility", price: 900, rarity: "milspec", icon: "🔫" },
    { id: 33, name: "AK-47 | Blue Laminate", price: 1100, rarity: "milspec", icon: "🔫" },
    { id: 34, name: "M4A1-S | Boreal Forest", price: 1300, rarity: "milspec", icon: "🔫" },
    { id: 35, name: "AWP | Worm God", price: 1500, rarity: "milspec", icon: "🔫" },
    { id: 36, name: "P90 | Elite Build", price: 1700, rarity: "milspec", icon: "🔫" },
    { id: 37, name: "MP7 | Skulls", price: 1900, rarity: "milspec", icon: "🔫" },
    { id: 38, name: "UMP-45 | Carbon Fiber", price: 2100, rarity: "milspec", icon: "🔫" },
    { id: 39, name: "FAMAS | Cyanospatter", price: 2400, rarity: "milspec", icon: "🔫" },
    { id: 40, name: "Galil AR | Tuxedo", price: 2700, rarity: "milspec", icon: "🔫" },
    { id: 41, name: "AK-47 | Redline", price: 3200, rarity: "restricted", icon: "🔫" },
    { id: 42, name: "M4A4 | Red DDPAT", price: 3800, rarity: "restricted", icon: "🔫" },
    { id: 43, name: "AWP | Redline", price: 4500, rarity: "restricted", icon: "🔫" },
    { id: 44, name: "Desert Eagle | Conspiracy", price: 5200, rarity: "restricted", icon: "🔫" },
    { id: 45, name: "USP-S | Orion", price: 6000, rarity: "restricted", icon: "🔫" },
    { id: 46, name: "Glock-18 | Reactor", price: 6800, rarity: "restricted", icon: "🔫" },
    { id: 47, name: "P250 | Nuclear Threat", price: 7500, rarity: "restricted", icon: "🔫" },
    { id: 48, name: "Five-SeveN | Case Hardened", price: 8500, rarity: "restricted", icon: "🔫" },
    { id: 49, name: "AK-47 | Vulcan", price: 12000, rarity: "classified", icon: "🔫" },
    { id: 50, name: "M4A4 | Asiimov", price: 16000, rarity: "classified", icon: "🔫" },
    { id: 51, name: "AWP | Asiimov", price: 20000, rarity: "classified", icon: "🔫" },
    { id: 52, name: "USP-S | Kill Confirmed", price: 25000, rarity: "classified", icon: "🔫" },
    { id: 53, name: "Glock-18 | Water Elemental", price: 30000, rarity: "classified", icon: "🔫" },
    { id: 54, name: "Desert Eagle | Code Red", price: 35000, rarity: "classified", icon: "🔫" },
    { id: 55, name: "P250 | Asiimov", price: 40000, rarity: "classified", icon: "🔫" },
    { id: 56, name: "Five-SeveN | Hyper Beast", price: 45000, rarity: "classified", icon: "🔫" },
    { id: 57, name: "AK-47 | Fire Serpent", price: 65000, rarity: "covert", icon: "🔫" },
    { id: 58, name: "M4A4 | Howl", price: 95000, rarity: "covert", icon: "🔫" },
    { id: 59, name: "AWP | Dragon Lore", price: 120000, rarity: "covert", icon: "🔫" },
    { id: 60, name: "AWP | Hyper Beast", price: 150000, rarity: "covert", icon: "🔫" },
    { id: 61, name: "M4A1-S | Printstream", price: 180000, rarity: "covert", icon: "🔫" },
    { id: 62, name: "Desert Eagle | Blaze", price: 200000, rarity: "covert", icon: "🔫" },
    { id: 63, name: "★ Gut Knife | Fade", price: 280000, rarity: "rare", icon: "🔪" },
    { id: 64, name: "★ Huntsman Knife | Fade", price: 320000, rarity: "rare", icon: "🔪" },
    { id: 65, name: "★ Flip Knife | Fade", price: 380000, rarity: "rare", icon: "🔪" },
    { id: 66, name: "★ Bayonet | Fade", price: 450000, rarity: "rare", icon: "🔪" },
    { id: 67, name: "★ Karambit | Fade", price: 520000, rarity: "rare", icon: "🔪" },
    { id: 68, name: "★ Butterfly Knife | Fade", price: 600000, rarity: "rare", icon: "🔪" }
];

console.log('const serverSkins = [');

mySkins.forEach((skin, index) => {
    const fileName = files[index]; // Берем файл с тем же номером, что и индекс скина (0 = skin-1)
    
    if (fileName) {
        skin.image = `/images/skins/${fileName}`;
    } else {
        skin.image = ""; // Если файлов меньше, чем скинов
    }
    
    // Формируем красивую строку для вывода
    const imageStr = skin.image ? `image: "${skin.image}"` : '';
    console.log(`    { id: ${skin.id}, name: "${skin.name}", price: ${skin.price}, rarity: "${skin.rarity}", icon: "${skin.icon}", ${imageStr} },`);
});

console.log('];');
console.log('\n✅ Скопируй весь вывод выше и замени им свой старый массив serverSkins в коде!');