const fs = require('fs');
const path = require('path');

const skinsDir = path.join(__dirname, '..', 'public', 'images', 'skins');
const files = fs.readdirSync(skinsDir).filter(f => f.startsWith('skin-'));

console.log(`📁 Найдено файлов: ${files.length}\n`);

// Выводим список файлов с номерами
files.forEach((file, index) => {
    console.log(`${index + 1}. ${file}`);
});

console.log('\n✅ Если файлы есть — проблема в коде. Скинь мне первые 10 строк массива serverSkins!');