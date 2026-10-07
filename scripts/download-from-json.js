const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const urls = JSON.parse(fs.readFileSync('./urls.json', 'utf8'));
const downloadDir = path.join(__dirname, '..', 'public', 'images', 'skins');

if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
}

function downloadImage(url, index) {
    return new Promise((resolve) => {
        // Определяем расширение файла из URL
        const ext = url.split('.').pop().split('?')[0] || 'png'; 
        const fileName = `skin-${index + 1}.${ext}`;
        const filePath = path.join(downloadDir, fileName);

        const client = url.startsWith('https') ? https : http;

        client.get(url, (response) => {
            if (response.statusCode === 200) {
                const stream = fs.createWriteStream(filePath);
                response.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    console.log(`✅ Скачан: ${fileName}`);
                    resolve(fileName);
                });
            } else {
                console.log(`⚠️ Пропущен (ошибка ${response.statusCode}): ${url}`);
                resolve(null);
            }
        }).on('error', (err) => {
            console.log(`❌ Ошибка: ${err.message}`);
            resolve(null);
        });
    });
}

async function downloadAll() {
    console.log(`🚀 Начинаем скачивание ${urls.length} картинок...\n`);
    
    for (let i = 0; i < urls.length; i++) {
        await downloadImage(urls[i], i);
        // Небольшая задержка, чтобы сайт не заблокировал нас
        await new Promise(r => setTimeout(r, 300)); 
    }
    
    console.log('\n🎉 Готово! Все картинки в папке public/images/skins/');
}

downloadAll();