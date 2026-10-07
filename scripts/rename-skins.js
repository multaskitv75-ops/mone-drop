const fs = require('fs');
const path = require('path');

const skinsDir = path.join(__dirname, '..', 'public', 'images', 'skins');
const files = fs.readdirSync(skinsDir).filter(f => f.startsWith('skin-'));

console.log('🔄 Переименовываем файлы...\n');

files.forEach((file, index) => {
    // Пропускаем .svg файлы (это логотипы и мусор)
    if (file.endsWith('.svg')) {
        fs.unlinkSync(path.join(skinsDir, file));
        console.log(`️  Удален: ${file}`);
        return;
    }
    
    const oldPath = path.join(skinsDir, file);
    const newName = `skin-${index + 1}${path.extname(file)}`;
    const newPath = path.join(skinsDir, newName);
    
    fs.renameSync(oldPath, newPath);
    console.log(`✅ ${file} → ${newName}`);
});

console.log('\n✨ Готово! Теперь файлы начинаются с skin-1.webp');