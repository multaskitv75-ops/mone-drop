const fs = require('fs');
const path = require('path');
const https = require('https');

console.log('⬇️  Скачиваем базу скинов CS2 с GitHub...');

// Готовая база скинов из открытого репозитория
const SKINS_DB_URL = 'https://raw.githubusercontent.com/SteamDatabase/GameTracking-CS2/master/game/csgo/pak01_dir/scripts/items/items_game.txt';

function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', reject);
  });
}

// Парсим items_game.txt и извлекаем скины
function parseItemsGame(filePath) {
  console.log('🔍 Парсим файл items_game.txt...');
  
  const content = fs.readFileSync(filePath, 'utf8');
  const skins = [];
  
  // Ищем паттерны скинов (упрощённый парсинг)
  const skinPattern = /"(\d+)"\s*\{[^}]*"name"\s*"([^"]*)"[^}]*"item_name"\s*"([^"]*)"[^}]*"image_inventory"\s*"([^"]*)"[^}]*\}/gs;
  
  let match;
  let id = 1;
  
  while ((match = skinPattern.exec(content)) !== null) {
    const [_, classId, name, itemName, imageInventory] = match;
    
    // Фильтруем только скины оружия
    if (imageInventory && imageInventory.includes('econ/default_generated')) {
      skins.push({
        id: id++,
        classId: classId,
        name: itemName || name,
        imageInventory: imageInventory,
        rarity: 'common' // Будет определена позже
      });
    }
  }
  
  return skins;
}

async function main() {
  try {
    const tempFile = path.join(__dirname, 'items_game.txt');
    const outputDir = path.join(__dirname, '..', 'data');
    
    // Скачиваем файл
    await downloadFile(SKINS_DB_URL, tempFile);
    console.log('✅ Файл скачан');
    
    // Парсим
    const skins = parseItemsGame(tempFile);
    console.log(`📦 Найдено ${skins.length} скинов`);
    
    // Сохраняем
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'steam-skins.json');
    fs.writeFileSync(outputPath, JSON.stringify(skins, null, 2));
    console.log(`💾 Сохранено в ${outputPath}`);
    
    // Удаляем временный файл
    fs.unlinkSync(tempFile);
    
    console.log('\n🎉 Готово!');
    console.log('Примеры скинов:');
    skins.slice(0, 10).forEach(skin => {
      console.log(`  - ${skin.name}`);
    });
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
    console.log('\n💡 Попробуем альтернативный источник...');
    
    // Альтернатива: создаём базовую базу из известных скинов
    const fallbackSkins = createFallbackDatabase();
    const outputDir = path.join(__dirname, '..', 'data');
    fs.mkdirSync(outputDir, { recursive: true });
    const outputPath = path.join(outputDir, 'steam-skins.json');
    fs.writeFileSync(outputPath, JSON.stringify(fallbackSkins, null, 2));
    
    console.log(`✅ Создана базовая база из ${fallbackSkins.length} популярных скинов`);
  }
}

// Резервная база популярных скинов
function createFallbackDatabase() {
  return [
    { id: 1, name: "AK-47 | Redline", rarity: "classified", price: 2500 },
    { id: 2, name: "AK-47 | Vulcan", rarity: "classified", price: 12000 },
    { id: 3, name: "AK-47 | Fire Serpent", rarity: "covert", price: 65000 },
    { id: 4, name: "AK-47 | Asiimov", rarity: "covert", price: 75000 },
    { id: 5, name: "AK-47 | Blue Laminate", rarity: "milspec", price: 550 },
    { id: 6, name: "AWP | Asiimov", rarity: "classified", price: 20000 },
    { id: 7, name: "AWP | Dragon Lore", rarity: "covert", price: 120000 },
    { id: 8, name: "AWP | Hyper Beast", rarity: "covert", price: 150000 },
    { id: 9, name: "AWP | Redline", rarity: "classified", price: 3500 },
    { id: 10, name: "M4A4 | Asiimov", rarity: "classified", price: 16000 },
    { id: 11, name: "M4A4 | Howl", rarity: "covert", price: 95000 },
    { id: 12, name: "M4A1-S | Printstream", rarity: "covert", price: 180000 },
    { id: 13, name: "Desert Eagle | Blaze", rarity: "restricted", price: 200000 },
    { id: 14, name: "Desert Eagle | Code Red", rarity: "classified", price: 35000 },
    { id: 15, name: "Glock-18 | Fade", rarity: "restricted", price: 220000 },
    { id: 16, name: "USP-S | Kill Confirmed", rarity: "classified", price: 25000 },
    { id: 17, name: "USP-S | Orion", rarity: "restricted", price: 4500 },
    { id: 18, name: "★ Karambit | Fade", rarity: "rare", price: 450000 },
    { id: 19, name: "★ Butterfly Knife | Doppler", rarity: "rare", price: 520000 },
    { id: 20, name: "★ M9 Bayonet | Tiger Tooth", rarity: "rare", price: 480000 }
  ];
}

main();