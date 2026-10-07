const fs = require('fs');
const path = require('path');

const skinsDir = path.join(__dirname, '..', 'public', 'images', 'skins');
const dataJsPath = path.join(__dirname, '..', 'public', 'js', 'data.js');

console.log('🔄 Читаем файлы и обновляем data.js...\n');

// 1. Получаем список всех скачанных картинок
const files = fs.readdirSync(skinsDir).filter(f => f.startsWith('skin-'));

// 2. Создаем карту: { "1": "skin-1.webp", "2": "skin-2.png", ... }
const fileMap = {};
files.forEach(f => {
    const match = f.match(/skin-(\d+)\.(webp|png|svg|jpg)/);
    if (match) {
        fileMap[match[1]] = f;
    }
});

// 3. Читаем текущий data.js
let content = fs.readFileSync(dataJsPath, 'utf8');

// 4. Магическая замена: находим объекты скинов и добавляем image
const updatedContent = content.replace(
    /\{\s*id:\s*(\d+),\s*name:\s*"[^"]+",\s*price:\s*\d+,\s*rarity:\s*"[^"]+",\s*icon:\s*"[^"]*"\s*\}/g,
    (match, id) => {
        const fileName = fileMap[id];
        if (fileName) {
            // Добавляем свойство image перед закрывающей фигурной скобкой
            return match.replace(/\s*\}$/, `, image: "/images/skins/${fileName}" }`);
        }
        return match; // Если файла для этого ID нет, оставляем как есть
    }
);

// 5. Сохраняем обновленный файл
fs.writeFileSync(dataJsPath, updatedContent, 'utf8');

console.log('✅ УСПЕХ! Файл public/js/data.js обновлен.');
console.log(`📸 Добавлены пути к ${Object.keys(fileMap).length} картинкам.`);
console.log('\n🚀 Теперь перезагрузи страницу в браузере с полной очисткой кэша:');
console.log('   Windows: Ctrl + Shift + R');
console.log('   Mac: Cmd + Shift + R');